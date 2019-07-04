import { autoInjectable, inject } from "tsyringe";
import { Controller, ControllerAction } from "./controller";
import { Router } from "express";
import { Mapper } from "@wufe/mapper";
import Formidable from 'formidable';
import { existsSync } from 'fs';
import { resolve } from 'path';
import mkdirp from 'mkdirp';
import { IOCSymbols } from "@/infrastructure/ioc";
import uuid from 'uuid/v1';
import { PhotoEntity } from "@/data/entities/photo-entity";
import chalk from "chalk";
import Size from 'image-size';
import { PostEntity } from "@/data/entities/post-entity";
import { UserEntity } from "@/data/entities/user-entity";

@autoInjectable()
export class PostController extends Controller {
	static register = (router: Router): void => PostController.attachRouter(
		router,
		`/api/post`,
		() => new PostController());

	private _uploadDir: string;

	constructor(
		@inject(Mapper) private _mapper?: Mapper,
		@inject(IOCSymbols.UPLOAD_DIR) uploadDir?: string,
	) {
		super();
		this._uploadDir = resolve(uploadDir);
		if (!existsSync(this._uploadDir)) {
			mkdirp(this._uploadDir, (err, made) => {
				if (err) {
					console.error(err);
					process.exit(1);
				} else {
					console.warn(made);
				}
			});
		}	
	}

	POSTS_LIMIT = 10;

	after: ControllerAction<PostController> = {
		method: 'get',
		path: '/after',
		handler: controller =>  async (req, res) => {
			const uuid = req.query.uuid;
			if (uuid === 'void' || !uuid) {
				const posts = await PostEntity.find({
					order: { id: 'ASC' },
					take: this.POSTS_LIMIT,
					relations: [
						'photos',
						'user'
					]});
				return res.json(posts.map(x => this._mapper.map(x)));
			}
			console.log(uuid);
			res.json([]);
		}
	}

	new: ControllerAction<PostController> = {
		method: 'post',
		path: `/new`,
		handler: controller => (req, res) => {
			let photos: PhotoEntity[] = [];
			let post = new PostEntity();
			let username = "";
			const form = new Formidable.IncomingForm();
			console.log(req.body);
			form.maxFileSize = 200 * 1024 * 1024;
			form.on('field', (name: 'description' | 'username', value) => {
				switch (name) {
					case 'description':
						post.description = value;
						break;
					case 'username':
						username = value;
						break;
				}
			})
			.on('fileBegin', (name, file) => {
				const ext = file.name.match(/\.(\w{2,4})$/i)[1];
				const photoEntity = new PhotoEntity();
				
				photoEntity.description = "";
				photoEntity.width = 0;
				photoEntity.height = 0;
				photoEntity.uuid = uuid();
				photoEntity.name = file.name;
				photoEntity.src = `${photoEntity.uuid}.${ext}`;
				photos.push(photoEntity);
				file.path = `${this._uploadDir}/${photoEntity.src}`;				
			})
			.on('end', () => {
				username = username.trim() || 'Anonimo';
				UserEntity.findOne({ where: { username }})
					.then(user => {
						if (!user) {
							user = new UserEntity()
							user.username = username;
							return user.save();
						}
						return user;
					})
					.then(user => {
						photos
							.forEach(photo => {
								const fullPath = `${this._uploadDir}/${photo.src}`;
								const { height, width } = Size(fullPath);
								photo.height = height;
								photo.width = width;
							});
						PhotoEntity.save(photos)
							.then(photos => {
								post.photos = photos;
								return post.save();
							}).then(post => {
								if (!user.posts)
									user.posts = [];
								user.posts.push(post);
								return user.save()
									.then(user => {
										post.user = user;
										return post;
									});
							}).then(post => {
								res.status(200).json(this._mapper.map(post));
							}).catch(err => {
								res.status(500).send(err.toString());
							});
					});
				
			});
			form.parse(req, (err, fields, files) => {
				if (err) {
					console.error('Error', err)
					throw err
				}
			})
			
		}
	}
}