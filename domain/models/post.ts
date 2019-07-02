import { PhotoModel } from "./photo";

export class PostModel {
	creator: string;
	description: string;
	photos: PhotoModel[] = [];
}