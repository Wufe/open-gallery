import * as React from 'react';
import loadable from '@loadable/component';

type Photo = {
	src: string;
	width: number;
	height: number;
	key: string;
}

const getPhotos = (): Photo[] => new Array(200)
	.fill(null)
	.map((_, i) => {
		const width = Math.round((Math.floor(Math.random() * 500) + 600)/10)*10;
		const height = Math.round((Math.floor(Math.random() * 400) + 300)/10)*10;
		return {
			key: `${i}`,
			src: `https://source.unsplash.com/random/${width}x${height}`,
			width: width,//Math.floor(Math.random() * 4) +1,
			height: height//Math.floor(Math.random() * 4) +1
		}
	});

const Gallery = loadable(() => import('react-photo-gallery'), {
	ssr: false
});

export class PhotoGallery extends React.Component<{}, {photos: Photo[]}> {

	constructor(props: {}) {
		super(props);
		this.state = {
			photos: getPhotos()
		}
	}

	render = () => <>
		<Gallery photos={this.state.photos} direction={"column"} />
	</>;
}