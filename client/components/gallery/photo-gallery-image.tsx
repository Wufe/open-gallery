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
import { SelectableImage } from '../image/selectable-image';

export type CustomPhotoProps = Photo & {
	lazy?: LazyLoadRepo;
};

type OwnProps = RenderImageProps<CustomPhotoProps> & {};

export const PhotoGalleryImage = class extends React.Component<OwnProps> {

	private _lazyRef: React.RefObject<LazyLoadImage> = React.createRef();

	render = () => {
		const containerStyle: React.CSSProperties = {}
		if (this.props.direction === 'column') {
			containerStyle.position = 'absolute';
			containerStyle.left = `${this.props.left}px`;
			containerStyle.top = `${this.props.top}px`;
		}

		const imgStyle: React.CSSProperties = {
			width: this.props.photo.width -20,
			height: this.props.photo.height -20,
		};

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
			className={`lazy__container`}
			style={{
				...containerStyle,
				width: this.props.photo.width,
				height: this.props.photo.height
			}}>
				<SelectableImage {...this.props.photo}>
					<LazyLoadImage
						useSelfRef={false}
						ref={this._lazyRef}
						imgClass={'gallery-image ' + (this.props.photo.selected ? `lazy__image--selected` : '')}
						imgStyle={imgStyle}
						lazy={this.props.photo.lazy}
						src={src} />
				</SelectableImage>

				
			</div>
	}
}

export const PhotoGalleryImageContainer = (props: OwnProps) => <PhotoGalleryImage {...props} />