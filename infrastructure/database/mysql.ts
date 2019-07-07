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
import { IOCSymbols } from "../ioc";

const isProd = process.env.NODE_ENV !== 'development';

export class MysqlDatabaseBuilder implements IDatabaseBuilder {
	initConnection = (): Promise<Connection> => {
		const connection = createConnection({
			type: 'mysql',
			username: container.resolve(IOCSymbols.MYSQL_USER) as string,
			password: container.resolve(IOCSymbols.MYSQL_PASS) as string,
			host: container.resolve(IOCSymbols.MYSQL_HOST) as string,
			port: +(container.resolve(IOCSymbols.MYSQL_PORT) as string),
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
		connection.catch(err => {
			console.error(err);
			console.log('Halting.');
			process.exit(1);
		})
		return connection;
	}
}