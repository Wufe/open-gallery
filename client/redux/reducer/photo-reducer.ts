import { PhotoHandlingState, getInitialPhotoHandlingState, getInitialPhotoSettingsState, PhotoSettingsState } from "../state/photo-state";
import { Action, AnyAction } from "redux";
import { SELECT_PHOTO_ACTION, UNSELECT_PHOTO_ACTION, PHOTO_FETCH_REQUESTED_ACTION, PHOTO_FETCH_SUCCEEDED_ACTION, PHOTO_FETCH_FAILED_ACTION, PHOTO_RESET } from "../action/photo-action";

export const photoSettingsReducer = (state: PhotoSettingsState = getInitialPhotoSettingsState(), action: AnyAction) => {
	switch (action.type) {
		case PHOTO_RESET:
			return getInitialPhotoSettingsState();
		default:
			return state;
	}
}

export const photoHandlingReducer = (state: PhotoHandlingState = getInitialPhotoHandlingState(), action: Action) => {
	switch (action.type) {
		case SELECT_PHOTO_ACTION:
			{
				const { payload: uuid } = action as AnyAction;
				const index = state.photos.findIndex(x => x.uuid === uuid);
				if (index === -1)
					return state;
				const photo = state.photos[index];
				return {
					...state,
					photos: [
						...state.photos.slice(0, index),
						{
							...photo,
							selected: true
						},
						...state.photos.slice(index +1)
					]
				};
			}
		case UNSELECT_PHOTO_ACTION:
			{
				const { payload: uuid } = action as AnyAction;
				const index = state.photos.findIndex(x => x.uuid === uuid);
				if (index === -1)
					return state;
				const photo = state.photos[index];
				return {
					...state,
					photos: [
						...state.photos.slice(0, index),
						{
							...photo,
							selected: false
						},
						...state.photos.slice(index +1)
					]
				};
			}
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
		default:
			return state;
	}
}