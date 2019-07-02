import * as React from 'react';
import loadable from '@loadable/component';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getPhotoModule } from '@/client/redux/module/photo-module';

const PhotoGallery = loadable(() => import('@/client/components/gallery/photo-gallery'), {
	ssr: false
})

const PhotoGalleryContainer = () =>
	<DynamicModuleLoader modules={[getPhotoModule()]}>
		<PhotoGallery />
	</DynamicModuleLoader>;

export default PhotoGalleryContainer;