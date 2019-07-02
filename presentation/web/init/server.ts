import { initMapper } from "../../../infrastructure/mapper";
import { container } from "tsyringe";
import { GenericRepository } from "../../../data/repositories/generic-repository";
import { getDatabaseBuilder } from "../../../infrastructure/database/index";
import { initIOCContainer } from "@/infrastructure/ioc";
import { DatabaseSeeder } from "@/infrastructure/database/fixture";

export const initServer = async () => {

	// Init IOC container
	await initIOCContainer();

	// Object to object Mapper
	initMapper();

	// Register repositories
	container.registerType(GenericRepository, GenericRepository);

	// Database connection
	await getDatabaseBuilder().initConnection();

	// // Graphql endpoint
	// const { url } = await initGraphql();
	// console.log(`GraphQL server available on url ${url}`);

	// Database data fixture
	await new DatabaseSeeder().seedDatabase();
};