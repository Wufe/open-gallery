import { Controller, ControllerAction } from "./controller";
import { Router } from "express";
import { inject, autoInjectable } from "tsyringe";
import { Mapper } from "@wufe/mapper";
import Passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import JWT from 'jsonwebtoken';
import { IOCSymbols } from "@/infrastructure/ioc";
import BCrypt from 'bcryptjs';
import { UserEntity } from "@/data/entities/user-entity";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from "@/domain/models/user";
import { UserRole } from "@/data/enums/user-enums";

@autoInjectable()
export class AuthenticationController extends Controller {
	static register = (router: Router): void => AuthenticationController.attachRouter(router, '/auth', () => new AuthenticationController());

	constructor(
		@inject(Mapper) private _mapper?: Mapper,
		@inject(IOCSymbols.JWT_SECRET) private _jwtSecret?: string) {
		super();
		Passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		}, (email, password, callback) => {
			new Promise((resolve, reject) => {
				UserEntity.findOne({ where: { email } })
					.then(user => {
						if (user && BCrypt.compareSync(password, user.password)) {
							resolve({..._mapper.map(user)});
						} else {
							reject();
						}
					})
			})
			.then(user => {
				callback(null, user, { message: 'Logged in successfully.' });
			})
			.catch(error => {
				callback(new Error(error && error.toString() || 'Wrong credentials.'), null, {
					message: 'Wrong credentials.'
				});
			});
		}));
		Passport.use(new JWTStrategy({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: this._jwtSecret
		}, (payload, done) => {
			done(null, payload);
		}));
	}

	adminAuth: ControllerAction<AuthenticationController> = {
		method: 'post',
		path: '/admin',
		handler: controller => (req, res) => {
			Passport.authenticate('local', { session: false }, (err, user: UserModel, info) => {
				if (err || !user) {
					return res.status(401).json({
						message: 'Authentication error',
						error: err && err.toString(),
						info
					});
				}
				req.login(user, { session: false }, err => {
					if (err) return res.send(err);
					if (!user.email) return res.send({ error: 'No email' });
					UserEntity.findOne({ where: { email: user.email }})
						.then(user => {
							if (user && user.role === UserRole.ADMIN) {
								const userModel: UserModel = {...this._mapper.map(user)};
								const token = JWT.sign(userModel, this._jwtSecret);
								return res.json({ user: userModel, token });
							} else {
								res.sendStatus(403);
							}
						});
					
				});
			})(req, res);
		}
	}

	auth: ControllerAction<AuthenticationController> = {
		method: 'post',
		path: '/login',
		handler: controller => (req, res) => {
			Passport.authenticate('local', { session: false }, (err, user: UserModel, info) => {
				if (err || !user) {
					return res.status(400).json({
						message: 'Authentication error',
						error: err && err.toString(),
						info
					});
				}
				req.login(user, { session: false }, err => {
					if (err) return res.send(err);
					if (!user.email) return res.send({ error: 'No email' });
					UserEntity.findOne({ where: { email: user.email }})
						.then(user => {
							if (user) {
								const userModel: UserModel = {...this._mapper.map(user)};
								const token = JWT.sign(userModel, this._jwtSecret);
								return res.json({ user: userModel, token });
							} else {
								res.sendStatus(403);
							}
						});
					
				});
			})(req, res);
		}
	}
}