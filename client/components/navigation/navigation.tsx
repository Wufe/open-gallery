import * as React from 'react';
import './navigation.scss';
import { HomeIcon } from '../icons/home-icon';
import { AddIcon } from '../icons/add-icon';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { MapStateToProps, connect, MapDispatchToProps } from 'react-redux';
import { IdentityModuleOwnState } from '@/client/redux/state/identity-state';
import { SelectionIcon } from '../icons/selection-icon';
import { PhotoModuleOwnState } from '@/client/redux/state/photo-state';
import { ENABLE_SELECTION, DELETE_PHOTOS } from '@/client/redux/action/photo-action';
import { RemoveIcon } from '../icons/remove-icon';

type OwnProps = {}

type StateProps = {
	isAdmin: boolean;
	selectionEnabled: boolean;
	selectedPhotos: string[];
}

type DispatchProps = {
	enableSelection: () => void;
	deletePhotos: (uuids: string[]) => void;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, IdentityModuleOwnState & PhotoModuleOwnState> = state => ({
	isAdmin: state.identity.isAdmin,
	selectionEnabled: state.photoSettings.selection.enabled,
	selectedPhotos: Object.keys(state.photoSettings.selection.photos),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	enableSelection: () => dispatch({ type: ENABLE_SELECTION }),
	deletePhotos: (uuids: string[]) => dispatch({ type: DELETE_PHOTOS, payload: uuids }),
});

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps

const Navigation = withRouter(connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {

	go(location: string) {
		document.location.href = location;
	}

	activateSelection = () => {
		this.props.enableSelection();
	}

	deletePhotos = () => {
		this.props.deletePhotos(this.props.selectedPhotos);
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
					{!this.props.selectionEnabled && <div
						className={`navigation__link ${this.props.isAdmin ? '' : 'navigation__link--hidden'}`}
						onClick={this.activateSelection}>
						<div className="navigation__link-icon">
							<SelectionIcon />
						</div>
						<div className="navigation__link-name">Seleziona</div>
					</div>}
					{this.props.selectionEnabled && <div
						className={`navigation__link ${this.props.isAdmin ? '' : 'navigation__link--hidden'}`}
						onClick={this.deletePhotos}>
						<div className="navigation__link-icon">
							<RemoveIcon />
						</div>
						<div className="navigation__link-name">Cancella {this.props.selectedPhotos.length > 0 ? `${this.props.selectedPhotos.length} foto` : ''}</div>
					</div>}
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