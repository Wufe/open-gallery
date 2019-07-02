import { IDatabaseBuilder } from "./database-types";
import { Connection, createConnection } from "typeorm";
import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from "tsyringe";
import { PhotoEntity } from "@/data/entities/photo-entity";
import { PhotoFormatEntity } from "@/data/entities/photo-format-entity";
import { PostEntity } from "@/data/entities/post-entity";
import { UserEntity } from "@/data/entities/user-entity";
import { AlbumEntity } from "@/data/entities/album-entity";

export class MysqlDatabaseBuilder implements IDatabaseBuilder {
	initConnection = (): Promise<Connection> => {
		const connection = createConnection({
			type: 'mysql',
			username: 'root',
			password: 'toor',
			host: '127.0.0.1',
			port: 3307,
			database: 'gallery',
			entities: [
				AlbumEntity,
				PostEntity,
				PhotoEntity,
				PhotoFormatEntity,
				UserEntity
			],
			synchronize: true,
			logger: "simple-console",
			logging: ["error"]
		});
		 
		connection.then(connectionInstance => container.registerInstance(Connection, connectionInstance));
		return connection;
	}
}