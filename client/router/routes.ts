import { renderRoutes, RouteConfig } from 'react-router-config';
import loadable from '@loadable/component';

const HomePage = loadable(() => import('../components/pages/home/home'));
const AboutPage = loadable(() => import('../components/pages/about/about'));
const PostPage = loadable(() => import('../components/pages/post/post'));
const AlbumPage = loadable(() => import('../components/pages/album/album'));
const NewPostPage = loadable(() => import('../components/pages/post/new-post'));
const LoginPage = loadable(() => import('../components/pages/login/login'));

export const routes: RouteConfig[] = [
	{
		path: "/",
		exact: true,
		component: HomePage
	},
	{
		path: "/login",
		component: LoginPage
	},
	{
		path: "/album/:id",
		component: AlbumPage
	},
	{
		path: '/post/new',
		component: NewPostPage
	},
	{
		path: "/post/:id",
		component: PostPage
	},
];