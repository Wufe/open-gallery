import * as React from 'react';
import './header.scss';

type Props = {
	title?: string;
}

export class Header extends React.Component<Props> {

	static defaultProps: Props = {
		title: 'Photo gallery'
	}

	render = () =>
		<div className="header__container">
			<div className="header">
				{this.props.title!}
			</div>
		</div>
}