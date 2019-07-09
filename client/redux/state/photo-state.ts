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

type SelectedPhotosDictionary = {
	[uuid: string]: PhotoModel;
}

export type PhotoSettingsState = {
	selection: {
		enabled: boolean;
		photos: SelectedPhotosDictionary;
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
		enabled: false,
		photos: {}
	}
});