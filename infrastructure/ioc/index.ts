import { container } from 'tsyringe';
import Chalk from 'chalk';

export const IOCSymbols = {
	JWT_SECRET: Symbol('jwt_secret'),
	ADMIN_EMAIL: Symbol('admin_email'),
	ADMIN_PASSWORD: Symbol('admin_password'),
	UPLOAD_DIR: Symbol('upload_dir'),
	PUBLIC_UPLOAD_URL: Symbol('public_upload_url'),
}

export const initIOCContainer = async (): Promise<void> => {
	const isProd = process.env.NODE_ENV !== 'development';

	let JWT_SECRET = process.env.JWT_SECRET;
	if (!JWT_SECRET) {
		if (isProd) {
			console.error('Environment variable `JWT_SECRET` not set.');
			console.error('Halting.');
			process.exit(1);
		} else {
			console.log('Environment variable `JWT_SECRET` not set.');
			console.log('Using `dev_jwt`.');
			JWT_SECRET = 'dev_jwt';
		}
	}

	let ADMIN_EMAIL = process.env.ADMIN_EMAIL;
	if (!ADMIN_EMAIL) {
		if (isProd) {
			console.error('Environment variable `ADMIN_EMAIL` not set.');
			console.error('Halting.');
			process.exit(1);
		} else {
			console.log('Environment variable `ADMIN_EMAIL` not set.');
			console.log('Using `admin@gallery.com`.');
			ADMIN_EMAIL = 'admin@gallery.com';
		}
	}

	let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
	if (!ADMIN_PASSWORD) {
		if (isProd) {
			console.error('Environment variable `ADMIN_PASSWORD` not set.');
			console.error('Halting.');
			process.exit(1);
		} else {
			console.log('Environment variable `ADMIN_PASSWORD` not set.');
			console.log('Using `ciccio`.');
			ADMIN_PASSWORD = 'ciccio';
		}
	}

	let UPLOAD_DIR = process.env.UPLOAD_DIR;
	if (!UPLOAD_DIR) {
		if (isProd) {
			console.error('Environment variable `UPLOAD_DIR` not set.');
			console.error('Halting.');
			process.exit(1);
		} else {
			console.log('Environment variable `UPLOAD_DIR` not set.');
			console.log('Using `public/uploads`.');
			UPLOAD_DIR = 'public/uploads';
		}
	}

	let PUBLIC_UPLOAD_URL = process.env.PUBLIC_UPLOAD_URL;
	if (!PUBLIC_UPLOAD_URL) {
		if (isProd) {
			console.error('Environment variable `PUBLIC_UPLOAD_URL` not set.');
			console.error('Halting.');
			process.exit(1);
		} else {
			console.log('Environment variable `PUBLIC_UPLOAD_URL` not set.');
			console.log('Using `/uploads/`.');
			PUBLIC_UPLOAD_URL = '/uploads';
		}
	}

	container.registerInstance(IOCSymbols.JWT_SECRET, JWT_SECRET);
	container.registerInstance(IOCSymbols.ADMIN_EMAIL, ADMIN_EMAIL);
	container.registerInstance(IOCSymbols.ADMIN_PASSWORD, ADMIN_PASSWORD);
	container.registerInstance(IOCSymbols.UPLOAD_DIR, UPLOAD_DIR);
	container.registerInstance(IOCSymbols.PUBLIC_UPLOAD_URL, PUBLIC_UPLOAD_URL);
	
}