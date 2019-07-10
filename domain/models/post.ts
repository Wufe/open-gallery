import { PhotoModel } from "./photo";

export class PostModel {
	uuid: string;
	creator: string;
	description: string;
	deleted: boolean;
	photos: PhotoModel[] = [];
}