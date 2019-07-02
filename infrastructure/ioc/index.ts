import { container } from 'tsyringe';
import Chalk from 'chalk';

export const IOCSymbols = {
	JWT_SECRET: Symbol('jwt_secret'),
	ADMIN_EMAIL: Symbol('admin_email'),
	ADMIN_PASSWORD: Symbol('admin_password'),
}

export const initIOCContainer = async (): Promise<void> => {
	const isProd = process.env.NODE_ENV !== 'development';

	let JWT_SECRET = process.env.JWT_SECRET;
	if (!JWT_SECRET) {
		if (isProd) {
			console.error(Chalk.red.bgBlack('Environment variable `JWT_SECRET` not set.'));
			console.error(Chalk.red.bgBlack('Halting.'));
			process.exit(1);
		} else {
			console.log(Chalk.yellow.bgBlack('Environment variable `JWT_SECRET` not set.'));
			console.log(Chalk.yellow.bgBlack('Using `dev_jwt`.'));
			JWT_SECRET = 'dev_jwt';
		}
	}

	let ADMIN_EMAIL = process.env.ADMIN_EMAIL;
	if (!ADMIN_EMAIL) {
		if (isProd) {
			console.error(Chalk.red.bgBlack('Environment variable `ADMIN_EMAIL` not set.'));
			console.error(Chalk.red.bgBlack('Halting.'));
			process.exit(1);
		} else {
			console.log(Chalk.yellow.bgBlack('Environment variable `ADMIN_EMAIL` not set.'));
			console.log(Chalk.yellow.bgBlack('Using `admin@gallery.com`.'));
			ADMIN_EMAIL = 'admin@gallery.com';
		}
	}

	let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
	if (!ADMIN_PASSWORD) {
		if (isProd) {
			console.error(Chalk.red.bgBlack('Environment variable `ADMIN_PASSWORD` not set.'));
			console.error(Chalk.red.bgBlack('Halting.'));
			process.exit(1);
		} else {
			console.log(Chalk.yellow.bgBlack('Environment variable `ADMIN_PASSWORD` not set.'));
			console.log(Chalk.yellow.bgBlack('Using `ciccio`.'));
			ADMIN_PASSWORD = 'ciccio';
		}
	}

	container.registerInstance(IOCSymbols.JWT_SECRET, JWT_SECRET);
	container.registerInstance(IOCSymbols.ADMIN_EMAIL, ADMIN_EMAIL);
	container.registerInstance(IOCSymbols.ADMIN_PASSWORD, ADMIN_PASSWORD);
	
}