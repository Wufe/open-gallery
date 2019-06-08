import * as React from 'react';
import loadable from '@loadable/component';
import { PhotoGallery } from '../../gallery/photo-gallery';

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slideToShow: 1,
	slidesToScroll: 1
}

// const Slider = loadable(() => import('react-slick'), { ssr: false });

const Home = () =>
	<PhotoGallery />;
	// <div style={{
	// 	textAlign: 'center',
	// 	width: '800px',
	// 	margin: '0 auto'
	// }}>
	// 	<Slider>
	// 		<div style={{
	// 			textAlign: 'center',
	// 			display: 'flex',
	// 			justifyContent: 'center'
	// 		}}>
	// 			<img src="https://source.unsplash.com/random" alt="" />
	// 		</div>
	// 		<div style={{
	// 			textAlign: 'center',
	// 			display: 'flex',
	// 			justifyContent: 'center'
	// 		}}>
	// 			<img src="https://source.unsplash.com/random" alt="" />
	// 		</div>
	// 		<div style={{
	// 			textAlign: 'center',
	// 			display: 'flex',
	// 			justifyContent: 'center'
	// 		}}>
	// 			<img src="https://source.unsplash.com/random" alt="" />
	// 		</div>
	// 		<div style={{
	// 			textAlign: 'center',
	// 			display: 'flex',
	// 			justifyContent: 'center'
	// 		}}>
	// 			<img src="https://source.unsplash.com/random" alt="" />
	// 		</div>
	// 		<div style={{
	// 			textAlign: 'center',
	// 			display: 'flex',
	// 			justifyContent: 'center'
	// 		}}>
	// 			<img src="https://source.unsplash.com/random" alt="" />
	// 		</div>
	// 	</Slider>
	// </div>;

export default Home;