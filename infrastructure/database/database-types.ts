import { Connection } from "typeorm";

export interface IDatabaseBuilder {
	initConnection: () => Promise<Connection>;
}