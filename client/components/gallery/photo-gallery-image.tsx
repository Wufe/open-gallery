import * as React from 'react';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import { PhotoProps, RenderImageProps } from 'react-photo-gallery';
import { LoadableLibrary } from '@loadable/component';
import './photo-gallery-image.scss';
import { PhotoAdditionalProperties, PhotoModuleOwnState, Photo } from '@/client/redux/state/photo-state';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { selectPhoto, unselectPhoto } from '@/client/redux/action/photo-action';
import { PhotoModel } from '@/domain/models/photo';
import EXIF from 'exif-js';
import { Checkmark } from '../icons/checkmark-icon';
import { LazyLoadImage } from '../lazy-load/lazy-load-image';

export type CustomPhotoProps = Photo & {
	lazy?: LazyLoadRepo;
};

type OwnProps = RenderImageProps<CustomPhotoProps> & {};

type StateProps = {
	selectionEnabled: boolean;
};

type DispatchProps = {
	select: (uuid: string) => void;
	unselect: (uuid: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PhotoModuleOwnState> = state => ({
	selectionEnabled: state.photoSettings ? state.photoSettings.selection.enabled : false
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	select: uuid => dispatch(selectPhoto(uuid)),
	unselect: uuid => dispatch(unselectPhoto(uuid))
});

export const PhotoGalleryImage = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {

	private _containerRef: React.RefObject<HTMLDivElement> = React.createRef();
	private _lazyRef: React.RefObject<LazyLoadImage> = React.createRef();

	onContainerClick = () => {
		if (!this.props.selectionEnabled)
			return;
		if (this.props.photo.selected) {
			this.props.unselect(this.props.photo.uuid);
		} else {
			this.props.select(this.props.photo.uuid);
		}
	}

	render = () => {
		const containerStyle: React.CSSProperties = {}
		if (this.props.direction === 'column') {
			containerStyle.position = 'absolute';
			containerStyle.left = `${this.props.left}px`;
			containerStyle.top = `${this.props.top}px`;
		}

		const imgStyle: React.CSSProperties = {
			width: this.props.photo.width,
			height: this.props.photo.height,
		};
		const scaleX = (100 - (30 / this.props.photo.width) * 100) / 100;
		const scaleY = (100 - (30 / this.props.photo.height) * 100) / 100;
		if (this.props.photo.selected)
			imgStyle.transform = `translateZ(0px) scale3d(${scaleX}, ${scaleY}, 1)`;

		const photo = this.props.photo;

		let src = photo.src;
		if (photo.formats && photo.formats.medium) {
			src = photo.formats.medium.src;
		} else {
			if (photo.formats.big) {
				src = photo.formats.big.src;
			} else {
				if (photo.formats.original) {
					src = photo.formats.original.src;
				}
			}
		}

		return <div
			ref={element => { this._lazyRef.current.register(element) }}
			className={`lazy__container ${this.props.selectionEnabled ? 'lazy__container--selectable' : ''}`}
			style={{
				...containerStyle,
				width: this.props.photo.width,
				height: this.props.photo.height
			}}
			onClick={this.onContainerClick}>
				<Checkmark selected={this.props.photo.selected} />
				<LazyLoadImage
					useSelfRef={false}
					ref={this._lazyRef}
					imgClass={this.props.photo.selected ? `lazy__image--selected` : ''}
					imgStyle={imgStyle}
					intersectionElementRef={this._containerRef}
					lazy={this.props.photo.lazy}
					src={src} />
			</div>
	}
})

export const PhotoGalleryImageContainer = (props: OwnProps) => <PhotoGalleryImage {...props} />