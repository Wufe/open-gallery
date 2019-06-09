import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { mapTo } from "@wufe/mapper";
import { PhotoModel } from "@/domain/models/photo";

@Entity()
@mapTo(PhotoModel)
export class PhotoEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uuid: string;

	@Column()
	src: string;

	@Column({ default: ''})
	lowQualityPlaceholderSrc: string = '';

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
}