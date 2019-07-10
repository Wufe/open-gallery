import { Controller, ControllerAction } from "./controller";
import { Router } from "express";
import { inject, autoInjectable } from "tsyringe";
import { Mapper } from "@wufe/mapper";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { IOCSymbols } from "@/infrastructure/ioc";
import Passport from 'passport';
import { UserModel } from "@/domain/models/user";
import { UserRole } from "@/data/enums/user-enums";
import { PhotoFormatEntity } from "@/data/entities/photo-format-entity";
import { In } from "typeorm";
import { PhotoEntity } from "@/data/entities/photo-entity";

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

	removePhotos: ControllerAction<AdminController> = {
		method: 'post',
		path: '/photos/delete',
		handler: controller => (req, res) => {
			const uuids = req.body.uuids;
			if (!uuids || !uuids.length){
				res.status(400).send('No photos to delete.');
			} else {
				PhotoEntity
					.find({
						where: {
							uuid: In(uuids)
						},
						relations: ['formats']
					})
					.then(photos => {
						photos
							.forEach(photo => photo.deleted = true);
						PhotoEntity.save(photos)
							.then(() => {
								res.status(200).json({
									message: `Cancellate ${photos.length} foto.`
								});
							});
					})
			}
			
		}
	}


}