import Express from 'express';
import Logger from 'morgan';
import Proxy from 'express-http-proxy';
import { exec } from 'child_process';
import bodyParser from 'body-parser';

export const initFrontendProxyApp = async () => {

	const isProd = process.env.NODE_ENV !== 'development';
	console.log(`Frontend server environment: ${isProd ? 'production' : 'development'}`);
	const loggerInstance = Logger(isProd ? 'tiny' : 'dev');

	const router = Express.Router();
	const PORT = 8083;

	router.use(loggerInstance);

	if (!isProd) {
		const webpack = await import('webpack').then(x => x.default);
		const webpackConfigurationBuilder = await import('../../../webpack.config.js').then(x => x.client);
		const webConfig = webpackConfigurationBuilder('web', true);
		const compiler = webpack([webConfig]);
		const devMiddleware = await import('webpack-dev-middleware').then(x => x.default);
		router.use(devMiddleware(compiler, {
			publicPath: webConfig.output.publicPath,//.slice(0, webConfig.output.publicPath.length -1),
			stats: {
				assets: false,
				modules: false
			},
			logLevel: 'error'
		}));
		const hotMiddleware = await import('webpack-hot-middleware').then(x => x.default);
		router.use(hotMiddleware(compiler));
		router.use(Proxy('localhost:8082'));

		const backendProcess = exec(
			`"node" node_modules/.bin/nodemon -w dist/server-backend.js dist/server-backend.js`,
			{ cwd: process.cwd() });
		backendProcess
			.stdout
			.on('data', data => console.log(data.toString()));
		backendProcess
			.stderr
			.on('data', data => console.error(data.toString()));

		Express()
			.use(bodyParser.json({ limit: '200mb' }))
			.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }))
			.use(router)
			.listen(PORT, () => {
				console.log(`Listening on port ${PORT}`);
			});
	} else {
		console.error(`
		Front-end web server is useless in production.
		Use web app server instead.
		Static assets will be served from there instead.
		`);
	}
	

}