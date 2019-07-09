import { PostState, getInitialPostState, UploadPostState, getInitialUploadPostState } from "../state/post-state";
import { AnyAction } from "redux";
import { UPLOAD_POST_RESET_ACTION, LOADED_POST_BEFORE_ACTION, LOADED_POST_AFTER_ACTION } from "../action/post-action";
import { PostModel } from "@/domain/models/post";

export const postReducer = (state: PostState = getInitialPostState(), action: AnyAction): PostState => {
	switch (action.type){
		case LOADED_POST_BEFORE_ACTION:
			{
				const posts = action.payload
					.filter((x: PostModel) => x.photos.length);
				return {
					...state,
					posts: [
						...posts,
						...state.posts,
					]
				} as PostState;
			}
		case LOADED_POST_AFTER_ACTION:
			{
				const posts = action.payload
					.filter((x: PostModel) => x.photos.length);
				return {
					...state,
					posts: [
						...state.posts,
						...posts,
					]
				} as PostState;
			}
		default:
			return state;
	}
}

export const uploadPostReducer = (state: UploadPostState = getInitialUploadPostState(), action: AnyAction): UploadPostState => {
	switch (action.type) {
		case UPLOAD_POST_RESET_ACTION:
			{
				return getInitialUploadPostState();
			}
		default:
			return state;
	}
}