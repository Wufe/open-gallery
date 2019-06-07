import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from "tsyringe";
import { Mapper } from "@wufe/mapper";

export const initMapper = (): Mapper => {
	const mapper = new Mapper();
	
	container.registerInstance(Mapper, mapper);

	return mapper;
}