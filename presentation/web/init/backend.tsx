import * as React from 'react';
import Express from 'express';
import { resolve, join, basename } from 'path';
import FS, { readFileSync } from 'fs';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import Logger from 'morgan';
import { AlbumController } from '../controllers/album-controller';
import Passport from 'passport';
import { Strategy } from 'passport-local';
import JWT from 'jsonwebtoken';
import { AuthenticationController } from '../controllers/authentication-controller';
import bodyParser from 'body-parser';
import { AdminController } from '../controllers/admin-controller';
import { PostController } from '../controllers/post-controller';

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
			.replace(`{{title}}`, 'Elisa e Vito')
			.replace(`{{html}}`, payload.html)
			.replace(`{{links}}`, payload.assets.links)
			.replace(`{{styles}}`, payload.assets.styles)
			.replace(`{{scripts}}`, payload.assets.scripts);

}

const isProd = process.env.NODE_ENV !== 'development';
console.log(`Backend server environment: ${isProd ? 'production' : 'development'}`);

const loggerInstance = Logger(isProd ? 'short' : 'dev');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initBackEndApp = async () => {
	const router = Express.Router();
	const PORT = 8082;
	
	const templateRenderer = new TemplateRenderer();

	router.use(bodyParser.json({ limit: '200mb' }));
	router.use(bodyParser.urlencoded({ extended: false, limit: '200mb', type: 'application/json' }));
	router.use(loggerInstance);

	const nodeStats = resolve(process.cwd(), 'dist', './node-stats.json');
	const webStats = resolve(process.cwd(), 'dist', './web-stats.json');

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
	AlbumController.register(router);
	AuthenticationController.register(router);
	PostController.register(router);

	router.get(["/", "/post/:id", "/album/:id", "/user/:id", "/login"], (req, res) => {
		// const param = req.params.id;
		const context = {};
		const payload = generateSSRPayload({
			context,
			location: req.url
		});
		res.send(templateRenderer.renderTemplate('spa.html', payload));
	});

	const listen = () => {
		const server = Express()
			.use(bodyParser.json({ limit: '200mb' }))
			.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }))
			.use(router)
			.listen(PORT, () => {
				console.log(`Web app server listening on port ${PORT}`);
			})
			.on('error', () => {
				console.error('Error while starting express server.. Retrying in 5 seconds..');
				delay(5000)
					.then(() => {
						listen();
					});
			});
	};
	listen();
	
}