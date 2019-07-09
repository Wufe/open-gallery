import * as React from 'react';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import { PhotoModel } from '@/domain/models/photo';
import { LazyLoadImage } from '../lazy-load/lazy-load-image';
import './photo-gallery-static-image.scss';
import { SelectableImage } from '../image/selectable-image';

type Props = {
	lazy: LazyLoadRepo;
	photo: PhotoModel;
}

export class PhotoGalleryStaticImage extends React.Component<Props> {

	private _lazyRef: React.RefObject<LazyLoadImage> = React.createRef();

	onRef = (element: HTMLElement) => {
		if (element) {
			this._lazyRef.current.register(element);
		}
	};

	render = () => {
		const photo = this.props.photo;
		const format = photo.formats.big || photo.formats.original;
		const ratio = (format.width / format.height);
		return <div
			className="post__static-photo-container"
			ref={this.onRef}>
			<div className="post__static-photo"
				style={{
					paddingTop: `${(format.height / format.width) * 100}%`,
				}}>
					<SelectableImage style={{
						position: 'absolute',
						top: 0,
						left: 0,
						bottom: 0,
						right: 0
					}} {...this.props.photo} selected={false}>
						<LazyLoadImage
							ref={this._lazyRef}
							imgStyle={{
								minHeight: '100%',
								minWidth: '100%',
								position: 'absolute',
							}}
							lazy={this.props.lazy}
							useSelfRef={false}
							src={format.src}
							imgClass="gallery-image"/>
					</SelectableImage>
				</div>
		</div>;
	}
}