import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, ManyToOne, BaseEntity } from "typeorm";
import { mapTo } from "@wufe/mapper";
import { PhotoModel } from "@/domain/models/photo";
import { PhotoFormatEntity } from "./photo-format-entity";
import { PostEntity } from "./post-entity";
import { UserEntity } from "./user-entity";

@Entity()
@mapTo(PhotoModel)
export class PhotoEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uuid: string;

	@Column()
	src: string;	

	@Column()
	width: number;

	@Column()
	height: number;

	@Column({ default: '' })
	description: string = ''

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToMany(type => PhotoFormatEntity, format => format.photo)
	formats: PhotoFormatEntity[];

	@ManyToOne(type => PostEntity, post => post.photos, { nullable: true })
	post: PostEntity;

	@ManyToOne(type => UserEntity, user => user.photos, { nullable: true })
	user: UserEntity;
}