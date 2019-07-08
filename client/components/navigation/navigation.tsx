import * as React from 'react';
import './navigation.scss';
import { HomeIcon } from '../icons/home-icon';
import { AddIcon } from '../icons/add-icon';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { MapStateToProps, connect } from 'react-redux';
import { IdentityModuleOwnState } from '@/client/redux/state/identity-state';
import { SelectionIcon } from '../icons/selection-icon';

type OwnProps = {}

type StateProps = {
	isAdmin: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, IdentityModuleOwnState> = state => ({
	isAdmin: state.identity.isAdmin,
});

type Props = OwnProps & StateProps & RouteComponentProps

const Navigation = withRouter(connect(mapStateToProps)(class extends React.Component<Props> {

	go(location: string) {
		document.location.href = location;
	}

	render() {

		const uploadButtonClass = this.props.location.pathname === '/post/new' ?
			'navigation__link--hidden' : '';

		return <>
			<div className="navigation__component">
				<div className="navigation__content">
					<div className="navigation__link" onClick={() => this.go('/')}>
						<div className="navigation__link-icon">
							<HomeIcon />
						</div>
						<div className="navigation__link-name">Home</div>
					</div>
					<div
						className={`navigation__link ${this.props.isAdmin ? '' : 'navigation__link--hidden'}`} onClick={() => this.go('/')}>
						<div className="navigation__link-icon">
							<SelectionIcon />
						</div>
						<div className="navigation__link-name">Seleziona</div>
					</div>
					<div
						className={`navigation__link navigation__link--textual navigation__link--primary ${uploadButtonClass}`}
						key="upload"
						onClick={() => this.go('/post/new')}>
						Carica
					</div>
				</div>
			</div>
		</>;
	}
}));

export default Navigation;