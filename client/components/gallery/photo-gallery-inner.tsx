import * as React from 'react';
import loadable, { LoadableLibrary } from '@loadable/component';
import { LazyLoadImageContainer, CustomPhotoProps } from '../lazy-load/lazy-load-image-container';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import { LazyLoadImage } from '../lazy-load/lazy-load-image';
import { PhotoProps } from 'react-photo-gallery';
import { MapStateToProps, connect, MapDispatchToProps } from 'react-redux';
import { PhotoModuleOwnState } from '@/client/redux/state/photo-state';
import Gallery from 'react-photo-gallery';
import { requestPhotoFetch } from '@/client/redux/action/photo-action';
import { Header } from '../header/header';
import { SubHeader } from '../header/sub-header';

type OwnProps = {};

type StateProps = {
	photos: GalleryPhoto[];
	fetching: boolean;
};

type DispatchProps = {
	requestPhotos: (from?: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

export type GalleryPhoto = PhotoProps<CustomPhotoProps>;

const LazyRepo = loadable.lib(() => import('@/client/repo/lazy-load-repo'), {
	ssr: false
})

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PhotoModuleOwnState> = state => ({
	photos: state.photoHandling.photos
		.map(x => ({
			...x,
			key: x.uuid
		}) as GalleryPhoto),
	fetching: state.photoHandling.fetching
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	requestPhotos: (from?: string) => dispatch(requestPhotoFetch(from))
});

const PhotoGalleryInner = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {

	componentDidMount() {
		window.addEventListener('scroll', this.onScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onScroll = (event: Event) => {
		const totalScroll = window.document.body.scrollHeight;
		const currentScroll = window.scrollY;
		const percentage = (currentScroll / totalScroll) * 100;
		if (percentage > 80 && !this.props.fetching) {
			this.props.requestPhotos(this.props.photos[this.props.photos.length -1].uuid);
		}
	}

	constructor(props: Props) {
		super(props);
	}

	render = () => <>
		<LazyRepo>
			{(lazy) => {
				const instance = lazy.buildLazy();
				return <>
					{this.props.photos && this.props.photos.length > 0 && <Gallery
						direction={"column"}
						photos={this.props.photos.map(x => ({...x, lazy: instance }))}
						renderImage={LazyLoadImage} />}
					{(!this.props.photos || !this.props.photos.length) && <SubHeader title={"Non ci sono foto"} />}
					</>;
			}}
		</LazyRepo>
	</>;
});

export default PhotoGalleryInner;