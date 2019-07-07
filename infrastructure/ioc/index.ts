import { container } from 'tsyringe';
import Chalk from 'chalk';

export const IOCSymbols = {
	JWT_SECRET: Symbol('jwt_secret'),
	ADMIN_EMAIL: Symbol('admin_email'),
	ADMIN_PASSWORD: Symbol('admin_password'),
	UPLOAD_DIR: Symbol('upload_dir'),
	PUBLIC_UPLOAD_URL: Symbol('public_upload_url'),
	MYSQL_HOST: Symbol('mysql_host'),
	MYSQL_PORT: Symbol('mysql_port'),
	MYSQL_USER: Symbol('mysql_user'),
	MYSQL_PASS: Symbol('mysql_pass'),
}

type RequiredEnvironmentVariables = {
	key: keyof typeof IOCSymbols;
	default: string;
}[];

export const initIOCContainer = async (): Promise<void> => {
	const isProd = process.env.NODE_ENV !== 'development';

	const required : RequiredEnvironmentVariables = [
		{
			key: 'JWT_SECRET',
			default: 'dev_jwt',
		},
		{
			key: 'ADMIN_EMAIL',
			default: 'admin@gallery.com',
		},
		{
			key: 'ADMIN_PASSWORD',
			default: 'ciccio',
		},
		{
			key: 'UPLOAD_DIR',
			default: 'public/uploads',
		},
		{
			key: 'PUBLIC_UPLOAD_URL',
			default: '/uploads',
		},,
		{
			key: 'MYSQL_HOST',
			default: '127.0.0.1',
		},
		{
			key: 'MYSQL_PORT',
			default: '3307',
		},
		{
			key: 'MYSQL_USER',
			default: 'root',
		},
		{
			key: 'MYSQL_PASS',
			default: 'toor',
		},
	]

	required.forEach(required => {
		let environmentVariable = process.env[required.key];
		if (!environmentVariable) {
			if (isProd) {
				console.error(`Environment variable \`${required.key}\` not set.`);
				console.error('Halting.');
				process.exit(1);
			} else {
				console.log(`Environment variable \`${required.key}\` not set.`);
				console.log(`Using \`${required.default}\`.`);
				environmentVariable = required.default;
			}
		}
		container.registerInstance(IOCSymbols[required.key], environmentVariable);
	});
	
}