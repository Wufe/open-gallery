import { ISagaModule } from "redux-dynamic-modules-saga";
import { AlbumModuleOwnState } from "../state/album-state";
import { albumHandlingReducer } from "../reducer/album-reducer";
import { albumSaga } from "@/client/saga/album-saga";

export const getAlbumModel = (): ISagaModule<AlbumModuleOwnState> => ({
	id: 'album',
	reducerMap: {
		albumHandling: albumHandlingReducer,
	},
	sagas: [
		albumSaga
	]
});