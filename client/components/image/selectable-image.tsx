import * as React from 'react';
import { Photo, PhotoModuleOwnState } from '@/client/redux/state/photo-state';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import { RenderImageProps } from 'react-photo-gallery';
import { MapStateToProps, connect, MapDispatchToProps } from 'react-redux';
import { SELECT_PHOTO_ACTION, UNSELECT_PHOTO_ACTION } from '@/client/redux/action/photo-action';
import './selectable-image.scss';
import { Checkmark } from '../icons/checkmark-icon';

type OwnProps = Photo & {
	lazy?: LazyLoadRepo;
	style?: React.CSSProperties;
}

type StateProps = {
	selectionEnabled: boolean;
	selected: boolean;
}

type DispatchProps = {
	selectPhoto: () => void;
	unselectPhoto: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PhotoModuleOwnState> = (state, own) => ({
	selectionEnabled: state.photoSettings.selection.enabled,
	selected: state.photoSettings.selection.photos[own.uuid] !== undefined,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, own) => ({
	selectPhoto: () => {
		const {description, formats, height, selected, src, uuid, width} = own;
		return dispatch({ type: SELECT_PHOTO_ACTION, payload: {
			description,
			formats,
			height,
			selected,
			src,
			uuid,
			width
		} });
	},
	unselectPhoto: () => dispatch({ type: UNSELECT_PHOTO_ACTION, payload: own.uuid }),
})

export const SelectableImage = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {

	toggleSelection = () => {
		if (!this.props.selectionEnabled)
			return;
		if (this.props.selected) {
			this.props.unselectPhoto();
		} else {
			this.props.selectPhoto();
		}
	}

	render = () => {
		return <div
			style={{
				...(this.props.style || {})
			}}
			className={`selectable-image__container ${this.props.selected && 'selectable-image__container--selected'}`}
			onClick={this.toggleSelection}>
			<Checkmark selected={this.props.selected} />
			{this.props.children}
		</div>
		
	}
});