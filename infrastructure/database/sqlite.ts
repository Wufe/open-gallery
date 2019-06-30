import { resolve } from 'path';
import { IDatabaseBuilder } from "./database-types";
import { createConnection, Connection } from "typeorm";
import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from 'tsyringe';
import { PhotoEntity } from '@/data/entities/photo-entity';
import { PhotoFormatEntity } from '@/data/entities/photo-format-entity';

export class Sqlite3DatabaseBuilder implements IDatabaseBuilder {
	initConnection = (): Promise<Connection> => {
		const connection = createConnection({
			type: 'sqlite',
			database: resolve(__dirname, 'db.db'),
			entities: [
				PhotoEntity,
				PhotoFormatEntity
			],
			synchronize: true,
			logger: "simple-console",
			logging: ["error"]
		});
		 
		connection.then(connectionInstance => container.registerInstance(Connection, connectionInstance));
		return connection;
	}
}