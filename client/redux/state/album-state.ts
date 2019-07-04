import { AlbumModel } from "@/domain/models/album";

export type AlbumModuleOwnState = {
	albumHandling: AlbumHandlingState;
}

export type AlbumHandlingState = {
	album?: AlbumModel;
}

export const getInitialAlbumHandlingState = (): AlbumHandlingState => ({
	album: undefined,
});