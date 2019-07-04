import { ISagaModule } from "redux-dynamic-modules-saga";
import { PostModuleOwnState } from "../state/post-state";
import { postReducer, uploadPostReducer } from "../reducer/post-reducer";
import { postSaga } from "@/client/saga/post-saga";

export const getPostModule = (): ISagaModule<PostModuleOwnState> => ({
	id: 'post',
	reducerMap: {
		post: postReducer,
		upload: uploadPostReducer,
	},
	sagas: [
		postSaga
	]
});