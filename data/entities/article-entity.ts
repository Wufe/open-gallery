import { ManyToOne, ManyToMany, JoinTable, Entity, BaseEntity, Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, OneToMany } from "typeorm";
import { CategoryEntity } from "./category-entity";
import { ObjectType } from 'type-graphql';
import { mapTo } from "@wufe/mapper";

@Entity()
@Tree("materialized-path")
export class ArticleEntity extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;
	
	@Column({ nullable: true })
	code: string;
	
	@Column({ nullable: true })
	ean: string;

	// A pack of lamps may contain 2 or more lamps
	@Column({ default: 1 })
	itemsPerPack: number;

	@TreeChildren()
	children: ArticleEntity[];

	@TreeParent()
	parent: ArticleEntity;

	@ManyToMany(type => CategoryEntity, category => category.articles)
	@JoinTable()
	categories: CategoryEntity[];
}