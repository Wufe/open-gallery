import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from "tsyringe";
import { Mapper } from "@wufe/mapper";
import { PhotoEntity } from "@/data/entities/photo-entity";
import { PhotoModel, PhotoFormatsDictionary } from "@/domain/models/photo";

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
	
	container.registerInstance(Mapper, mapper);

	return mapper;
}