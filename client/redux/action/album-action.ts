import { AnyAction } from "redux";
import { AlbumModel } from "@/domain/models/album";

export const ALBUM_FETCH_REQUESTED_ACTION = '@@Album/FetchRequested';
export const ALBUM_FETCH_SUCCEEDED_ACTION = '@@Album/FetchSucceeded';
export const ALBUM_FETCH_FAILED_ACTION = '@@Album/FetchFailed';

export const requestAlbumFetch = (id: number): AnyAction => ({
	type: ALBUM_FETCH_REQUESTED_ACTION,
	payload: id,
});

export const albumFetchSucceeded = (album: AlbumModel): AnyAction => ({
	type: ALBUM_FETCH_SUCCEEDED_ACTION,
	payload: album,
});

export const albumFetchFailed = (message: string): AnyAction => ({
	type: ALBUM_FETCH_FAILED_ACTION,
	payload: message,
});