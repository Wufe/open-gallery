import { Photo } from "./photo-state";
import { PhotoModel } from "@/domain/models/photo";
import { PostModel } from "@/domain/models/post";

export type PostModuleOwnState = {
	post: PostState;
	upload: UploadPostState;
}

export type PostState = {
	loading: boolean;
	posts: PostModel[];
	post?: PostModel;
}

export type UploadPostState = {
	photos: PhotoModel[];
	loading: boolean;
}

export const getInitialPostState = (): PostState => ({
	loading: false,
	posts: []
});

export const getInitialUploadPostState = (): UploadPostState => ({
	photos: [],
	loading: false
});