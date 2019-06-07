import { ArticleEntity } from "./article-entity";
import { ManyToMany, BaseEntity, Entity, Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, ManyToOne } from "typeorm";
import { mapTo } from "@wufe/mapper";

@Entity()
@Tree("materialized-path")
export class CategoryEntity extends BaseEntity {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@TreeChildren()
	children: CategoryEntity[];

	@TreeParent()
	parent: CategoryEntity;

	@ManyToMany(type => ArticleEntity, article => article.categories)
	articles: ArticleEntity[];
}