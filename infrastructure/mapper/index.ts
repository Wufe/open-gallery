import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from "tsyringe";
import { Mapper } from "@wufe/mapper";
import { PhotoEntity } from "@/data/entities/photo-entity";
import { PhotoModel, PhotoFormatsDictionary } from "@/domain/models/photo";
import { PostEntity } from "@/data/entities/post-entity";
import { PostModel } from "@/domain/models/post";
import { UserEntity } from "@/data/entities/user-entity";
import { UserModel } from "@/domain/models/user";
import { AlbumEntity } from "@/data/entities/album-entity";
import { AlbumModel } from "@/domain/models/album";
import { IOCSymbols } from "../ioc";
import { join } from 'path';
import { PhotoFormat } from "@/data/enums/photo-enums";
import { PhotoFormatModel } from "@/domain/models/photo-format";
import { PhotoFormatEntity } from "@/data/entities/photo-format-entity";

export const initMapper = (): Mapper => {

	const publicUrl = container.resolve(IOCSymbols.PUBLIC_UPLOAD_URL) as string;

	const mapper = new Mapper();
	mapper
		.createMap<PhotoEntity, PhotoModel>(PhotoEntity)
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true))
		.forMember('description', opt => opt.mapFrom(src => src.description))
		.forMember('height', opt => opt.mapFrom(src => src.height))
		.forMember('width', opt => opt.mapFrom(src => src.width))
		.forMember('src', opt => opt.mapFrom(src => join(publicUrl, src.src)))
		.forMember('uuid', opt => opt.mapFrom(src => src.uuid))
		.forMember('formats', opt =>
			opt.mapFrom(src =>
				(src.formats && src.formats.length ?
					src.formats
						.reduce<PhotoFormatsDictionary>((acc, format) => {
							acc[format.type] = mapper.map(format);
							return acc;
						}, {}) : {}) as PhotoFormatsDictionary));

	mapper.createMap<PhotoFormatEntity, PhotoFormatModel>(PhotoFormatEntity)
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true))
		.forMember('height', opt => opt.mapFrom(src => src.height))
		.forMember('width', opt => opt.mapFrom(src => src.width))
		.forMember('src', opt => opt.mapFrom(src => join(publicUrl, src.src)));

	mapper
		.createMap<PostEntity, PostModel>(PostEntity)
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true))
		.forMember('creator', opt => opt.mapFrom(src => (src.user && src.user.username) || ''))
		.forMember('description', opt => opt.mapFrom(src => src.description))
		.forMember('uuid', opt => opt.mapFrom(src => src.uuid))
		.forMember('photos', opt =>
			opt.mapFrom(src =>
				(src.photos && src.photos.length ?
					src.photos.map(x => mapper.map(x)) : [])));

	mapper
		.createMap<UserEntity, UserModel>(UserEntity)
		.forMember('email', opt => opt.mapFrom(src => src.email))
		.forMember('role', opt => opt.mapFrom(src => src.role))
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));

	mapper
		.createMap<AlbumEntity, AlbumModel>(AlbumEntity)
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true))
		.forMember('description', opt => opt.mapFrom(src => src.description))
		.forMember('createdAt', opt => opt.mapFrom(src => src.createdAt))
		.forMember('username', opt => opt.mapFrom(src => src.user && src.user.username || ''))
		.forMember('photos', opt => opt.mapFrom(src => src.photos ? src.photos.map(x => mapper.map(x)) : []));
		
	
	container.registerInstance(Mapper, mapper);

	return mapper;
}