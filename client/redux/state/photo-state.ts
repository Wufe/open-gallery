import uuid from 'uuid/v1';
import { PhotoModel } from "@/domain/models/photo";

export type PhotoModuleOwnState = {
	photoHandling: PhotoHandlingState;
	photoSettings: PhotoSettingsState;
}

export type PhotoHandlingState = {
	photos: Photo[];
	fetching: boolean;
}

export type PhotoSettingsState = {
	selection: {
		enabled: boolean;
	};
}

export type PhotoAdditionalProperties = {
	selected: boolean;
};

export type Photo = PhotoModel & PhotoAdditionalProperties

export const getInitialPhotoHandlingState = (): PhotoHandlingState => ({
	photos: [],
	fetching: false
});

export const getInitialPhotoSettingsState = (): PhotoSettingsState => ({
	selection: {
		enabled: false
	}
});