import { IModule } from "redux-dynamic-modules";
import { ISagaModule } from 'redux-dynamic-modules-saga';
import { GlobalState } from "../state/global-state";
import { photoHandlingReducer, photoSettingsReducer } from "../reducer/photo-reducer";
import { PhotoHandlingState, PhotoModuleOwnState } from "../state/photo-state";
import { photoSaga } from "@/client/saga/photo-saga";
import { requestPhotoFetch } from "../action/photo-action";

export const getPhotoModule = (): ISagaModule<PhotoModuleOwnState> => ({
	id: 'photo',
	reducerMap: {
		photoHandling: photoHandlingReducer,
		photoSettings: photoSettingsReducer
	},
	sagas: [
		photoSaga
	],
	initialActions: [requestPhotoFetch()]
});