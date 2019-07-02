import * as React from 'react';
import Express from 'express';
import { resolve, join, basename } from 'path';
import FS, { readFileSync } from 'fs';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import Logger from 'morgan';
import { ApiController } from '../controllers/api-controller';
import Passport from 'passport';
import { Strategy } from 'passport-local';
import JWT from 'jsonwebtoken';
import { AuthenticationController } from '../controllers/authentication-controller';
import bodyParser from 'body-parser';
import { AdminController } from '../controllers/admin-controller';

type ServerEntryPayload = {
	html: string;
	assets: {
		scripts: string;
		links: string;
		styles: string;
	}
}

type TemplateMap = {
	[name: string]: {
		path: string;
		content: string;
	}
};

class TemplateRenderer {

	templates: TemplateMap = {};
	templateNames = ['spa.html'];

	constructor() {
		this.buildTemplates();
	}

	private buildTemplates() {
		this.templates = this.templateNames
			.map(name => ({
				name,
				path: resolve(__dirname, '..', 'presentation', 'web', 'pages', name)
			}))
			.map(({name, path}) => ({
				name,
				path,
				content: readFileSync(path, 'utf8')
			}))
			.reduce((acc, {name, path, content}) => {
				acc[name] = { path, content };
				return acc;
			}, {});
	}

	renderTemplate = (template: string, payload: ServerEntryPayload) =>
		this.templates[template]
			.content
			.replace(`{{title}}`, 'Open gallery')
			.replace(`{{html}}`, payload.html)
			.replace(`{{links}}`, payload.assets.links)
			.replace(`{{styles}}`, payload.assets.styles)
			.replace(`{{scripts}}`, payload.assets.scripts);

}

const isProd = process.env.NODE_ENV !== 'development';
console.log(`Backend server environment: ${isProd ? 'production' : 'development'}`);

const loggerInstance = Logger(isProd ? 'tiny' : 'dev');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initBackEndApp = async () => {
	const router = Express.Router();
	const PORT = 8082;
	
	const templateRenderer = new TemplateRenderer();

	router.use(bodyParser.urlencoded({ extended: false }));
	router.use(bodyParser.json());
	router.use(loggerInstance);

	const nodeStats = resolve(__dirname, './node-stats.json');
	const webStats = resolve(__dirname, './web-stats.json');

	const generateSSRPayload = ({ location, context }: {
		location: string;
		context: any;
	}): ServerEntryPayload => {
		const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
		const { default: App } = nodeExtractor.requireEntrypoint()
		const Entry = App as any as React.ComponentType<{
			location: string;
			context: any;
		}>;
	
		const webExtractor = new ChunkExtractor({ statsFile: webStats });
		
		const html = renderToString(
			<ChunkExtractorManager extractor={webExtractor}>
				<Entry location={location} context={context} />
			</ChunkExtractorManager>);
	
		const payload: ServerEntryPayload = {
			html,
			assets: {
				scripts: webExtractor.getScriptTags(),
				links: webExtractor.getLinkTags(),
				styles: webExtractor.getStyleTags()
			}
		};

		return payload;
	}

	router.use(Express.static(resolve(__dirname, '..', 'public')));
	
	AdminController.register(router);
	ApiController.register(router);
	AuthenticationController.register(router);

	router.get(["/", "/post/:id", "/album/:id", "/user/:id", "/about"], (req, res) => {
		// const param = req.params.id;
		const context = {};
		const payload = generateSSRPayload({
			context,
			location: req.url
		});
		res.send(templateRenderer.renderTemplate('spa.html', payload));
	});

	let error = true;

	while (error) {
		try {
			error = false;
			const server = Express()
				.use(router)
				.listen(PORT, () => {
					if (isProd)
						console.log(`Web app server listening on port ${PORT}`);

					process.stdin.resume();

					function exitHandler(options, exitCode) {
						server.close();
						if (options.cleanup) console.log('clean');
						if (exitCode || exitCode === 0) console.log(exitCode);
						if (options.exit) process.exit();
					}

					//do something when app is closing
					process.on('exit', exitHandler.bind(null,{cleanup:true}));

					//catches ctrl+c event
					process.on('SIGINT', exitHandler.bind(null, {exit:true}));

					// catches "kill pid" (for example: nodemon restart)
					process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
					process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
				});
		} catch {
			error = true;
			await delay(2000);
		}
	}
	
}