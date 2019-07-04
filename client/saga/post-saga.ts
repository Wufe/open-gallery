import { UPLOAD_POST_REQUESTED_ACTION, UPLOAD_POST_SUCCEEDED_ACTION, UPLOAD_POST_FAILED_ACTION, LOAD_POST_AFTER_ACTION, LOAD_POST_BEFORE_ACTION, LOADED_POST_BEFORE_ACTION, LOADED_POST_AFTER_ACTION } from "../redux/action/post-action";
import { AnyAction } from "redux";
import { put, call, takeLeading, all } from "redux-saga/effects";
import { setLoading } from "../redux/action/application-action";
import Axios from "axios";
import { openModal, closeModal } from "../redux/action/modal-action";

export type PostInputModel = {
	files: File[];
	description: string;
	username: string;
}

const requestPostUpload = (post: PostInputModel) => {
	const formData = new FormData();
	for (let i = 0; i < post.files.length; i++) {
		formData.append(`file[${i}]`, post.files[i]);
	}
	formData.append('description', post.description);
	formData.append('username', post.username);
	return Axios.post(`/api/post/new`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

const requestPostsAfter = (uuid: string) => Axios.get(`/api/post/after?uuid=${uuid || 'void'}`)
	.then(x => x.data);

const requestPostsBefore = (uuid: string) => Axios.get(`/api/post/before?uuid=${uuid || 'void'}`)
	.then(x => x.data);
	

function *uploadPost(action: AnyAction) {
	try {
		yield put(setLoading(true));
		yield put(openModal('uploading-modal'))
		const post = yield call(requestPostUpload, action.payload);
		yield put({ type: UPLOAD_POST_SUCCEEDED_ACTION, payload: post });
	} catch (e) {
		yield put({ type: UPLOAD_POST_FAILED_ACTION, payload: e && e.toString() })
	} finally {
		yield put(setLoading(false));
		yield put(closeModal())
	}
}

function *loadPostAfter(action: AnyAction) {
	try {
		yield put(setLoading(true));
		const uuid = action.payload;
		const posts = yield call(requestPostsAfter, uuid);
		yield put({ type: LOADED_POST_AFTER_ACTION, payload: posts });
	} catch (e) {
		console.error(e);
	} finally {
		yield put(setLoading(false));
	}
}

function *loadPostBefore(action: AnyAction) {
	try {
		yield put(setLoading(true));
		const uuid = action.payload;
		const posts = yield call(requestPostsBefore, uuid);
		yield put({ type: LOADED_POST_BEFORE_ACTION, payload: posts });
	} catch (e) {
		console.error(e);
	} finally {
		yield put(setLoading(false));
	}
}

function *watchUploadPost() {
	yield takeLeading(UPLOAD_POST_REQUESTED_ACTION, uploadPost);
}

function *watchLoadPostAfter() {
	yield takeLeading(LOAD_POST_AFTER_ACTION, loadPostAfter);
}

function *watchLoadPostBefore() {
	yield takeLeading(LOAD_POST_BEFORE_ACTION, loadPostBefore);
}

export function *postSaga() {
	yield all([
		watchUploadPost(),
		watchLoadPostAfter(),
		watchLoadPostBefore(),
	])
}