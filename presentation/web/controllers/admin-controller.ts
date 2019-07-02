import { Controller, ControllerAction } from "./controller";
import { Router } from "express";
import { inject, autoInjectable } from "tsyringe";
import { Mapper } from "@wufe/mapper";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { IOCSymbols } from "@/infrastructure/ioc";
import Passport from 'passport';
import { UserModel } from "@/domain/models/user";
import { UserRole } from "@/data/enums/user-enums";

@autoInjectable()
export class AdminController extends Controller {
	static register = (router: Router): void => AdminController.attachRouter(
		router,
		'/admin',
		() => new AdminController(),
		Passport.authenticate('jwt', { session: false }),
		(req, res, next) => {
			if ((req.user as UserModel).role !== UserRole.ADMIN) {
				res.sendStatus(403);
			} else {
				next();
			}
		});

	constructor(
		@inject(Mapper) private _mapper?: Mapper,
		@inject(IOCSymbols.JWT_SECRET) private _jwtSecret?: string,
	) {
		super();
	}

	test: ControllerAction<AdminController> = {
		method: 'get',
		path: '/test',
		handler: controller => (req, res) => {
			res.json({ ok: 'ok' });
		}
	}


}