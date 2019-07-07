import * as React from 'react';
import { PostModel } from '@/domain/models/post';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import Gallery from 'react-photo-gallery';
import './dashboard-post.scss';
import { PhotoGalleryImage, PhotoGalleryImageContainer } from '../gallery/photo-gallery-image';
import { LazyLoadImage } from '../lazy-load/lazy-load-image';
import { PhotoGalleryStaticImage } from '../gallery/photo-gallery-static-image';

type Props = {
	post: PostModel;
	lazyLoadRepo: LazyLoadRepo;
}

export default class DashboardPost extends React.Component<Props> {

	render() {
		return <>
			<div className="dashboard-post__component">
				{this.props.post.description &&
					this.props.post.description.trim() &&
					<div className="post__description">
						<div className="post__edges post__edges--left" />
						<div className="post__edges post__edges--right" />
						<div className="post__author">~ {this.props.post.creator}</div>
						{this.props.post.description}
					</div>}
				{this.props.post.photos &&
					this.props.post.photos.length > 0 &&
					<>
						{this.props.post.photos.length <= 3 && <div className="post__static-photos-container">
							{this.props.post.photos.map((photo, index) =>
								<PhotoGalleryStaticImage lazy={this.props.lazyLoadRepo} photo={photo} key={index} />)}
						</div>}
						{this.props.post.photos.length > 3 &&
							<div className="post__photos-container">
								<Gallery
									direction="column"
									renderImage={PhotoGalleryImageContainer}
									photos={this.props.post.photos.map(x => ({ ...x, lazy: this.props.lazyLoadRepo }))} />
							</div>}
					</>}
			</div>
		</>
	}
}
