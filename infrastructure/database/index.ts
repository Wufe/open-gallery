import { Sqlite3DatabaseBuilder } from "./sqlite";
import { IDatabaseBuilder } from "./database-types";
import { MysqlDatabaseBuilder } from "./mysql";

export const getDatabaseBuilder = (): IDatabaseBuilder => new MysqlDatabaseBuilder();