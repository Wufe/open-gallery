import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany } from "typeorm";
import BCrypt from 'bcryptjs';
import { mapTo } from "@wufe/mapper";
import { UserModel } from "@/domain/models/user";
import { PhotoEntity } from "./photo-entity";
import { AlbumEntity } from "./album-entity";
import { UserRole } from "../enums/user-enums";
import { PostEntity } from "./post-entity";

@Entity()
@mapTo(UserModel, true)
export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	email: string;

	@Column({ default: '' })
	password: string;

	@Column({ nullable: true })
	username: string;

	@OneToMany(type => PostEntity, post => post.user)
	posts: PostEntity[];

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		if (this.password) {
			const rounds = BCrypt.getRounds(this.password);
			if (isNaN(rounds)) {
				const salt = BCrypt.genSaltSync(12);
				const hash = BCrypt.hashSync(this.password, salt);
				this.password = hash;
			}
		}
	}

	@Column({ type: String, default: UserRole.USER })
	role: UserRole;

	@OneToMany(type => PhotoEntity, photo => photo.user)
	photos: PhotoEntity[];

	@OneToMany(type => AlbumEntity, album => album.user)
	albums: AlbumEntity[];
}