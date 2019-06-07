import * as React from 'react';
import Entry from './components/entry';
import { StaticRouter } from 'react-router';

export default class NodeEntry extends React.Component<{
	location: string;
	context: any;
}> {
	render = () =>
		<StaticRouter location={this.props.location} context={this.props.context}>
			<Entry />
		</StaticRouter>;
}
