import { renderRoutes, RouteConfig } from 'react-router-config';
import loadable from '@loadable/component';

const HomePage = loadable(() => import('../components/pages/home/home'));
const AboutPage = loadable(() => import('../components/pages/about/about'));
const PostPage = loadable(() => import('../components/pages/post/post'));
const AlbumPage = loadable(() => import('../components/pages/album/album'));

export const routes: RouteConfig[] = [
	{
		path: "/",
		exact: true,
		component: HomePage
	},
	{
		path: "/about",
		component: AboutPage
	},
	{
		path: "/album/:id",
		component: AlbumPage
	},
	{
		path: "/post/:id",
		component: PostPage
	}
];