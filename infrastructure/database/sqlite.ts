import { resolve } from 'path';
import { IDatabaseBuilder } from "./database-types";
import { createConnection, Connection } from "typeorm";
import { ArticleEntity } from "../../data/entities/article-entity";
import { CategoryEntity } from "../../data/entities/category-entity";
import { container } from 'tsyringe';

export class Sqlite3DatabaseBuilder implements IDatabaseBuilder {
	initConnection = (): Promise<Connection> => {
		const connection = createConnection({
			type: 'sqlite',
			database: resolve(__dirname, 'db.db'),
			entities: [
				ArticleEntity,
				CategoryEntity
			],
			synchronize: true,
			logger: "simple-console",
			logging: ["error"]
		});
		 
		connection.then(connectionInstance => container.registerInstance(Connection, connectionInstance));
		return connection;
	}
}