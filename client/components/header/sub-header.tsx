import * as React from 'react';
import './sub-header.scss';

type Props = {
	title: string;
}

export class SubHeader extends React.Component<Props> {

	render = () =>
		<div className="sub-header__container">
			<div className="sub-header">
				{this.props.title}
			</div>
		</div>
}