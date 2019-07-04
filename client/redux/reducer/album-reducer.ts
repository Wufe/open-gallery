import { AlbumHandlingState, getInitialAlbumHandlingState } from "../state/album-state";
import { AnyAction } from "redux";
import { ALBUM_FETCH_SUCCEEDED_ACTION } from "../action/album-action";
import { AlbumModel } from "@/domain/models/album";

export const albumHandlingReducer = (state: AlbumHandlingState = getInitialAlbumHandlingState(), action: AnyAction) => {
	switch (action.type) {
		case ALBUM_FETCH_SUCCEEDED_ACTION:
			{
				const album = action.payload as AlbumModel;
				return {
					...state,
					album,
				};
			}
		default:
			return state;
	}
}