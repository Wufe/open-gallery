import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { mapTo } from "@wufe/mapper";
import { PhotoModel } from "@/domain/models/photo";
import { PhotoFormatEntity } from "./photo-format-entity";

@Entity()
@mapTo(PhotoModel)
export class PhotoEntity {
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
}