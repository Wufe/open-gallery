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
import { MoreThan, LessThan } from "typeorm";
import { PhotoFormatsDictionary } from "@/domain/models/photo";
import { PhotoFormat } from "@/data/enums/photo-enums";
import { performance } from 'perf_hooks';
import Sharp from 'sharp';
import { PhotoFormatEntity } from "@/data/entities/photo-format-entity";

type DimensionsPerFormat = {
	[k in PhotoFormat]?: number;
}

const dimensionsPerFormat: DimensionsPerFormat = {
	original: 99999,
	big: 1920,
	medium: 768,
	small: 640,
}

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

	getGenericPosts = async (): Promise<PostEntity[]> => {
		const posts = await PostEntity.find({
			order: { id: 'DESC' },
			take: this.POSTS_LIMIT,
			relations: [
				'photos',
				'user',
				'photos.formats'
			]});
		// console.log(posts[0].uuid, posts[0].photos);
		return posts;
	}

	after: ControllerAction<PostController> = {
		method: 'get',
		path: '/after',
		handler: controller =>  async (req, res) => {

			let posts: PostEntity[] = [];

			const uuid = req.query.uuid;
			if (uuid === 'void' || !uuid) {
				posts = await this.getGenericPosts();
			} else {
				const relativePost = await PostEntity.findOne({
					where: { uuid }
				});
				if (!relativePost) {
					posts = await this.getGenericPosts();
				} else {
					posts = await PostEntity.find({
						where: { id: MoreThan(relativePost.id) },
						order: { id: 'ASC' },
						take: this.POSTS_LIMIT,
						relations: [ 'photos', 'user', 'photos.formats' ]
					});
					posts = posts.sort((x, y) => y.id - x.id);
				}
			}

			return res.json(posts.map(x => this._mapper.map(x)));	
			
		}
	}

	before: ControllerAction<PostController> = {
		method: 'get',
		path: '/before',
		handler: controller =>  async (req, res) => {

			let posts: PostEntity[] = [];

			const uuid = req.query.uuid;
			if (uuid === 'void' || !uuid) {
				posts = await this.getGenericPosts();
			} else {
				const relativePost = await PostEntity.findOne({
					where: { uuid }
				});
				if (!relativePost) {
					posts = await this.getGenericPosts();
				} else {
					posts = await PostEntity.find({
						where: { id: LessThan(relativePost.id) },
						order: { id: 'DESC' },
						take: this.POSTS_LIMIT,
						relations: [ 'photos', 'user', 'photos.formats' ]
					});
				}
			}

			return res.json(posts.map(x => this._mapper.map(x)));	
			
		}
	}

	new: ControllerAction<PostController> = {
		method: 'post',
		path: `/new`,
		handler: controller => async (req, res) => {
			let photos: PhotoEntity[] = [];
			let post = new PostEntity();
			let username = "";
			const form = new Formidable.IncomingForm();
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
			.on('end', async () => {
				username = username.trim() || 'Anonimo';
				UserEntity.findOne({ where: { username }, relations: ['posts'] })
					.then(user => {
						if (!user) {
							user = new UserEntity()
							user.username = username;
							return user.save();
						}
						return user;
					})
					.then(async user => {

						const start = performance.now();

						for (const photo of photos) {
							const fullPath = `${this._uploadDir}/${photo.src}`;
							const [_, originalName, originalExt] = photo.src.match(/^(.+?)\.(\w{2,4})$/i);
							const originalFileName = `original_${originalName}.jpg`;
							const originalPath = `${this._uploadDir}/${originalFileName}`;

							await Sharp(fullPath)
								.rotate()
								.jpeg()
								.toFile(originalPath);

							const { height, width } = Size(originalPath);
							photo.height = height;
							photo.width = width;

							const ratio = width / height;

							const formats: PhotoFormat[] = [ PhotoFormat.BIG, PhotoFormat.MEDIUM, PhotoFormat.SMALL];

							const formatEntity = new PhotoFormatEntity();
							formatEntity.src = originalFileName;
							formatEntity.width = width;
							formatEntity.height = height;
							formatEntity.type = PhotoFormat.ORIGINAL;
							await formatEntity.save();

							const formatEntities = [formatEntity];

							for (const format of formats) {
								let maxSizePerFormat: number | undefined = dimensionsPerFormat[format]
								const biggerDimension = Math.max(width, height);
								if (!maxSizePerFormat || biggerDimension < maxSizePerFormat)
									maxSizePerFormat = biggerDimension;

								let formatWidth = width;
								let formatHeight = height;
								if (width > height) {
									formatWidth = maxSizePerFormat;
									formatHeight = Math.round(formatWidth / ratio);
								} else {
									formatHeight = maxSizePerFormat;
									formatWidth = Math.round(formatHeight * ratio);
								}

								const formatFileName = `${format}_${originalName}.jpg`;
								const formatPath = `${this._uploadDir}/${formatFileName}`;

								await Sharp(originalPath)
									.resize(formatWidth, formatHeight)
									.toFile(formatPath);

								const formatEntity = new PhotoFormatEntity();
								formatEntity.src = formatFileName;
								formatEntity.width = formatWidth;
								formatEntity.height = formatHeight;
								formatEntity.type = format;
								await formatEntity.save();
								
								formatEntities.push(formatEntity);
							}
							
							photo.formats = formatEntities;

							await photo.save();
						}

						const end = performance.now();
						const timing = end - start;

						console.log({ timing });

						await post.save();

						if (!user.posts)
							user.posts = [];
						user.posts.push(post);
						await user.save();

						post.user = user;
						post.photos = photos;
						await post.save();

						res.status(200).json(this._mapper.map(post));
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