import * as React from 'react';
import loadable from '@loadable/component';
import { useState } from 'react';
import "../styles/index.scss";
import { Link, Route } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes } from '../router/routes';

const HomePage = loadable(() => import('./pages/home/home'));
const AboutPage = loadable(() => import('./pages/about/about'));

const Entry = () => {
	const [page, setPage] = useState('page1');

	return <>
		<Link to={`/`}>Home</Link>
		<Link to={`/about`}>About</Link>
		{renderRoutes(routes)}
	</>;
}

export default Entry;