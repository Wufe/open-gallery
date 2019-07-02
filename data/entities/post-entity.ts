import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PhotoEntity } from "./photo-entity";
import { mapTo } from "@wufe/mapper";
import { PostModel } from "@/domain/models/post";

@Entity()
@mapTo(PostModel, true)
export class PostEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	creator: string;

	@Column()
	description: string;

	@OneToMany(type => PhotoEntity, photo => photo.post)
	photos: PhotoEntity[];
}