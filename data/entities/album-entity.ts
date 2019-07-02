import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne } from "typeorm";
import { mapTo } from "@wufe/mapper";
import { UserEntity } from "./user-entity";

@Entity()
// @mapTo(AlbumModel)
export class AlbumEntity extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: '' })
	description: string;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@ManyToOne(type => UserEntity, user => user.albums)
	user: UserEntity;

}