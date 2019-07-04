import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { mapTo } from "@wufe/mapper";
import { UserEntity } from "./user-entity";
import { AlbumModel } from "@/domain/models/album";
import { PhotoEntity } from "./photo-entity";

@Entity()
@mapTo(AlbumModel)
export class AlbumEntity extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: '' })
	description: string;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@ManyToMany(type => PhotoEntity, photo => photo.albums)
	photos: PhotoEntity[];

	@ManyToOne(type => UserEntity, user => user.albums)
	user: UserEntity;

}