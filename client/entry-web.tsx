import * as React from 'react';
import { render, hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { BrowserRouter } from 'react-router-dom';
import Entry from './components/entry';

const element = document.getElementById('app');

const App = (props: React.ClassAttributes<any> & { Entry: React.ComponentFactory<any, any> }) =>
	<BrowserRouter>
		<Entry />
	</BrowserRouter>;

loadableReady(() => render(<App Entry={Entry} />, element));

if (module.hot) {
	module.hot.accept('./components/entry', () => {
		import('./components/entry')
			.then(x => x.default)
			.then(NewEntry => {
				render(<App Entry={NewEntry} />, element);
			});
	});
}