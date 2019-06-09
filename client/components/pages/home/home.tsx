import * as React from 'react';
import loadable from '@loadable/component';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getPhotoModule } from '@/client/redux/module/photo-module';

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slideToShow: 1,
	slidesToScroll: 1
}

const PhotoGallery = loadable(() => import('@/client/components/gallery/photo-gallery'), {
	ssr: false
})

const Home = () =>
	<DynamicModuleLoader modules={[getPhotoModule()]}>
		<PhotoGallery />
	</DynamicModuleLoader>;

export default Home;