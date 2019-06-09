import * as React from 'react';
import { RenderImageProps } from 'react-photo-gallery';
import loadable from '@loadable/component';
import { LazyLoadImageContainer, CustomPhotoProps } from './lazy-load-image-container';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';

type Props = {} & RenderImageProps<CustomPhotoProps>;


export class LazyLoadImage extends React.Component<Props> {

	render = () => {
		return <LazyLoadImageContainer {...this.props} />
	}
}