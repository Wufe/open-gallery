import { AnyAction } from "redux";
import { call, put, takeLeading, all, select } from 'redux-saga/effects';
import Axios from 'axios';
import { PHOTO_FETCH_SUCCEEDED_ACTION, photoFetchSucceeded, photoFetchFailed, PHOTO_FETCH_REQUESTED_ACTION, DELETE_PHOTOS } from "../redux/action/photo-action";
import { GlobalState } from "../redux/state/global-state";
import { IdentityModuleOwnState } from "../redux/state/identity-state";

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

export function *watchFetchPhoto() {
	yield takeLeading(PHOTO_FETCH_REQUESTED_ACTION, fetchPhoto);
}

const requestPhotosDeletion = (uuids: string[], token: string) =>
	Axios.post(`/admin/photos/delete`, { uuids }, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	}).then(x => x.data);

function *deletePhotos(action: AnyAction) {
	try {
		const token = yield select((state: IdentityModuleOwnState) =>
			state.authentication.token);
		if (!token) {
			alert('Token not found.');
			throw new Error('Token not found error.');
		}
		const response = yield call(requestPhotosDeletion, action.payload, token);
		alert(response.message);
		document.location.href = '/';
	} catch (e) {
		alert('Errore durante la cancellazione.');
		console.error(e);
	}
}

export function *watchDeletePhotos() {
	yield takeLeading(DELETE_PHOTOS, deletePhotos);
}

export function *photoSaga() {
	yield all([
		watchFetchPhoto(),
		watchDeletePhotos(),
	])
}