import * as React from 'react';
import Express from 'express';
import { resolve, join, basename } from 'path';
import { readFileSync } from 'fs';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import Logger from 'morgan';
import WebpackDevServer from 'webpack-dev-server';

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

// // TODO: Might think to fallback to production by default
const isProd = process.env.NODE_ENV === 'production';

export const initApp = async () => {
	const router = Express.Router();
	const PORT = 8082;
	
	const templateRenderer = new TemplateRenderer();

	let app = Express();

	router.use(Logger('dev'));

	if (!isProd) {
		const webpackDevServer = await import('webpack-dev-server')
			.then(x => x.default);
		const webpack = await import('webpack')
			.then(x => x.default);
		const webpackConfigurationBuilder = await import('../../../webpack.config.js')
			.then(x => x.client);
		const webConfig = webpackConfigurationBuilder('web', true);
		const compiler = webpack([webConfig]);
		const devMiddleware = await import('webpack-dev-middleware')
			.then(x => x.default);
		const middleware = devMiddleware(compiler, {
			publicPath: webConfig.output.publicPath.slice(0, webConfig.output.publicPath.length -1),
			writeToDisk(filePath) {
				return /dist\/node\//.test(filePath) || /loadable\-stats/.test(filePath) || /hot\-update/.test(filePath);
			},
			stats: {
				assets: false,
				modules: false
			},
			logLevel: 'error'
		});
		router.use(middleware);
		const hotMiddleware = await import('webpack-hot-middleware')
			.then(x => x.default);
		router.use(hotMiddleware(compiler));
	}

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
	router.get(["/", "/about"], (req, res) => {
		const context = {};
		const payload = generateSSRPayload({
			context,
			location: req.url
		});
		res.send(templateRenderer.renderTemplate('spa.html', payload));
	});

	Express()
		.use(router)
		.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	
}