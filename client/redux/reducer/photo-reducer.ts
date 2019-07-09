import { PhotoHandlingState, getInitialPhotoHandlingState, getInitialPhotoSettingsState, PhotoSettingsState } from "../state/photo-state";
import { Action, AnyAction } from "redux";
import { SELECT_PHOTO_ACTION, UNSELECT_PHOTO_ACTION, PHOTO_FETCH_REQUESTED_ACTION, PHOTO_FETCH_SUCCEEDED_ACTION, PHOTO_FETCH_FAILED_ACTION, PHOTO_RESET, ENABLE_SELECTION } from "../action/photo-action";
import { ALBUM_FETCH_SUCCEEDED_ACTION } from "../action/album-action";
import { AlbumModel } from "@/domain/models/album";
import { PhotoModel } from "@/domain/models/photo";

export const photoSettingsReducer = (state: PhotoSettingsState = getInitialPhotoSettingsState(), action: AnyAction) => {
	switch (action.type) {
		case PHOTO_RESET:
			return getInitialPhotoSettingsState();
		case SELECT_PHOTO_ACTION:
			{
				const photo = action.payload as PhotoModel;
				const uuid = photo.uuid;
				return {
					...state,
					selection: {
						...state.selection,
						photos: {
							...state.selection.photos,
							[uuid]: photo,
						}
					}
				} as PhotoSettingsState;
			}
		case UNSELECT_PHOTO_ACTION:
			{
				const uuid = action.payload;
				const {[uuid]: photo, ...rest} = state.selection.photos;
				return {
					...state,
					selection: {
						...state.selection,
						photos: rest
					}
				} as PhotoSettingsState;
			}
		case ENABLE_SELECTION:
			return {
				...state,
				selection: {
					...state.selection,
					enabled: true
				}
			} as PhotoSettingsState;
		default:
			return state;
	}
}

export const photoHandlingReducer = (state: PhotoHandlingState = getInitialPhotoHandlingState(), action: AnyAction) => {
	switch (action.type) {
		case PHOTO_FETCH_REQUESTED_ACTION:
			{
				return {
					...state,
					fetching: true
				}
			}
		case PHOTO_FETCH_SUCCEEDED_ACTION:
			{
				const { payload: newPhotos } = action as AnyAction;
				return {
					...state,
					fetching: false,
					photos: [
						...state.photos,
						...newPhotos
					]
				};
			}
		case PHOTO_FETCH_FAILED_ACTION:
			{
				return {
					...state,
					fetching: false
				};
			}
		case PHOTO_RESET:
			{
				return getInitialPhotoHandlingState();
			}
		case ALBUM_FETCH_SUCCEEDED_ACTION:
			{
				const album = action.payload as AlbumModel;
				return {
					...state,
					photos: album.photos,
				} as PhotoHandlingState;
			}
		default:
			return state;
	}
}