import { renderRoutes, RouteConfig } from 'react-router-config';
import loadable from '@loadable/component';

const HomePage = loadable(() => import('../components/pages/home/home'));
const AboutPage = loadable(() => import('../components/pages/about/about'));

export const routes: RouteConfig[] = [
	{
		path: "/",
		exact: true,
		component: HomePage
	},
	{
		path: "/about",
		component: AboutPage
	}
];