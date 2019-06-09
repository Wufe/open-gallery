import { injectable, autoInjectable, inject } from "tsyringe";
import { Request, Response, RequestHandler, Router } from "express";
import { container } from 'tsyringe';
import { Mapper } from "@wufe/mapper";
import { PhotoEntity } from "@/data/entities/photo-entity";
import uuid from 'uuid/v1';
import { ControllerAction, Controller } from "./controller";

@autoInjectable()
export class ApiController extends Controller {
	static register = (router: Router): void => ApiController.attachRouter(router, '/api', () => new ApiController());
	
	constructor(@inject(Mapper) private mapper?: Mapper) {
		super();
	}
	
	getImages: ControllerAction<ApiController> = {
		method: 'get',
		path: '/images',
		handler: controller => (req, res) => {
			const photoEntities = new Array(50)
				.fill(null)
				.map((_, i) => {
					const width = Math.round((Math.floor(Math.random() * 500) + 600)/10)*10;
					const height = Math.round((Math.floor(Math.random() * 400) + 300)/10)*10;
					const entity = new PhotoEntity();
					entity.uuid = uuid();
					entity.src = `https://source.unsplash.com/random/${width}x${height}`;
					entity.width = width;
					entity.height = height;
					return entity;
				});
			
			res.send(photoEntities.map(x => controller.mapper.map(x)));
		}
	}
}