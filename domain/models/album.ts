import { PhotoModel } from "./photo";

export class AlbumModel {
	description: string;

	createdAt: string;

	username: string;

	photos: PhotoModel[];
}