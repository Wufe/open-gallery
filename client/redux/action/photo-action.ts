import { Action, AnyAction } from "redux";
import { Photo } from "../state/photo-state";

export const SELECT_PHOTO_ACTION = '@@Photo/Select';

export const selectPhoto = (uuid: string): AnyAction => ({
	type: SELECT_PHOTO_ACTION,
	payload: uuid
})

export const UNSELECT_PHOTO_ACTION = '@@Photo/Unselect';

export const unselectPhoto = (uuid: string): AnyAction => ({
	type: UNSELECT_PHOTO_ACTION,
	payload: uuid
});

export const PHOTO_FETCH_REQUESTED_ACTION = '@@Photo/PhotoFetchRequested';

export const requestPhotoFetch = (from?: string): AnyAction => ({
	type: PHOTO_FETCH_REQUESTED_ACTION,
	payload: from
});

export const PHOTO_FETCH_SUCCEEDED_ACTION = '@@Photo/FetchSucceeded';

export const photoFetchSucceeded = (photos: Photo[]): AnyAction => ({
	type: PHOTO_FETCH_SUCCEEDED_ACTION,
	payload: photos
});

export const PHOTO_FETCH_FAILED_ACTION = '@@Photo/FetchFailed';

export const photoFetchFailed = (message: string): AnyAction => ({
	type: PHOTO_FETCH_FAILED_ACTION,
	payload: message
});

export const PHOTO_RESET = '@@Photo/Reset';

export const photoReset = (): Action => ({
	type: PHOTO_RESET,
});