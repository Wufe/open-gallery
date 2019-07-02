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

export const initMapper = (): Mapper => {
	const mapper = new Mapper();
	mapper
		.createMap<PhotoEntity, PhotoModel>(PhotoEntity)
		.forMember('formats', opt =>
			opt.mapFrom(src =>
				(src.formats && src.formats.length ?
					src.formats
						.reduce<PhotoFormatsDictionary>((acc, format) => {
							acc[format.type] = mapper.map(format);
							return acc;
						}, {}) : {}) as PhotoFormatsDictionary));

	mapper
		.createMap<PostEntity, PostModel>(PostEntity)
		.forMember('photos', opt =>
			opt.mapFrom(src =>
				(src.photos && src.photos.length ?
					src.photos.map(x => mapper.map(x)) : [])));

	mapper
		.createMap<UserEntity, UserModel>(UserEntity)
		.forMember('email', opt => opt.mapFrom(src => src.email))
		.forMember('role', opt => opt.mapFrom(src => src.role))
		.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));
		
	
	container.registerInstance(Mapper, mapper);

	return mapper;
}