import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { PhotoEntity } from "./photo-entity";
import { mapTo } from "@wufe/mapper";
import { PhotoFormatModel } from "@/domain/models/photo-format";
import { PhotoFormat } from "../enums/photo-enums";

@Entity()
@mapTo(PhotoFormatModel)
export class PhotoFormatEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: String, default: PhotoFormat.ORIGINAL })
	type: PhotoFormat;

	@Column()
	src: string;

	@Column()
	width: number;

	@Column()
	height: number;

	@ManyToOne(type => PhotoEntity, photo => photo.formats)
	photo: PhotoEntity;
}