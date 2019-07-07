import * as React from 'react';
import './navigation.scss';
import { HomeIcon } from '../icons/home-icon';
import { AddIcon } from '../icons/add-icon';
import { Link } from 'react-router-dom';

export default class Navigation extends React.Component {

	go(location: string) {
		document.location.href = location;
	}

	render() {
		return <>
			<div className="navigation__component">
				<div className="navigation__content">
					<div className="navigation__link" onClick={() => this.go('/')}>
						<div className="navigation__link-icon">
							<HomeIcon />
						</div>
						<div className="navigation__link-name">Home</div>
					</div>
					<div className="navigation__link navigation__link--textual" onClick={() => this.go('/post/new')}>
						Carica
						{/* <div className="navigation__link-icon">
							<AddIcon />
						</div> */}
						{/* <div className="navigation__link-name">Scrivi post</div> */}
					</div>
				</div>
			</div>
		</>;
	}
}