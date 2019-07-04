import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BaseEntity, ManyToOne } from "typeorm";
import { PhotoEntity } from "./photo-entity";
import { mapTo } from "@wufe/mapper";
import { PostModel } from "@/domain/models/post";
import uuid from 'uuid/v1';
import { UserEntity } from "./user-entity";

@Entity()
@mapTo(PostModel, true)
export class PostEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uuid: string;

	@Column()
	description: string;

	@OneToMany(type => PhotoEntity, photo => photo.post)
	photos: PhotoEntity[];

	@ManyToOne(type => UserEntity, user => user.posts)
	user: UserEntity;

	@BeforeInsert()
	generateUUID() {
		if (!this.uuid) {
			this.uuid = uuid();
		}
	}
}