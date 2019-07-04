import * as React from 'react';
import loadable from '@loadable/component';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getPhotoModule } from '@/client/redux/module/photo-module';

const PhotoGalleryInner = loadable(() => import('@/client/components/gallery/photo-gallery-inner'), {
	ssr: false
})

const PhotoGallery = () =>
	<DynamicModuleLoader modules={[getPhotoModule()]}>
		<PhotoGalleryInner />
	</DynamicModuleLoader>;

export default PhotoGallery;