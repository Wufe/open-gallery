import { injectable, autoInjectable, inject } from "tsyringe";
import { Request, Response, RequestHandler, Router } from "express";
import { container } from 'tsyringe';
import { Mapper } from "@wufe/mapper";
import { PhotoEntity } from "@/data/entities/photo-entity";
import uuid from 'uuid/v1';
import { ControllerAction, Controller } from "./controller";
import { AlbumModel } from "@/domain/models/album";
import { AlbumEntity } from "@/data/entities/album-entity";
import { UserEntity } from "@/data/entities/user-entity";
import { UserRole } from "@/data/enums/user-enums";

@autoInjectable()
export class AlbumController extends Controller {
	static register = (router: Router): void => AlbumController.attachRouter(router, '/api/album', () => new AlbumController());
	
	constructor(@inject(Mapper) private _mapper?: Mapper) {
		super();
	}
	
	getAlbum: ControllerAction<AlbumController> = {
		method: 'get',
		path: '/:id',
		handler: controller => (req, res) => {
			UserEntity.findOne({ where: { role: UserRole.ADMIN }})
				.then(admin => {
					const album = new AlbumEntity;
					album.createdAt = new Date().toISOString();
					album.description = "Mock album description";
					album.user = admin;
					album.photos = new Array(60)
						.fill(null)
						.map((_, i) => {
							const width = Math.round((Math.floor(Math.random() * 500) + 600)/10)*10;
							const height = Math.round((Math.floor(Math.random() * 400) + 300)/10)*10;
							const entity = new PhotoEntity();
							entity.uuid = uuid();
							entity.src = `https://source.unsplash.com/user/alipzn/${width}x${height}`;
							entity.width = width;
							entity.height = height;
							return entity;
						});
					res.send(this._mapper.map(album));
				})
				.catch(err => res.status(500).send(err));
		}
	}
}