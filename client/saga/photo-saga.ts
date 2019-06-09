import { AnyAction } from "redux";
import { call, put, takeLeading } from 'redux-saga/effects';
import Axios from 'axios';
import { PHOTO_FETCH_SUCCEEDED_ACTION, photoFetchSucceeded, photoFetchFailed, PHOTO_FETCH_REQUESTED_ACTION } from "../redux/action/photo-action";

const requestPhotos = (from?: string) => 
	Axios.get(`/api/images${from ? '?from=' + from : ''}`)
		.then(x => x.data);

function *fetchPhoto(action: AnyAction) {
	try {
		const photos = yield call(requestPhotos, action.payload)
		yield put(photoFetchSucceeded(photos));
	} catch (e) {
		yield put(photoFetchFailed(e.message));
	}
}

export function *photoSaga() {
	yield takeLeading(PHOTO_FETCH_REQUESTED_ACTION, fetchPhoto);
}