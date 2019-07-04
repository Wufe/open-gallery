import { takeLeading, put, call } from "redux-saga/effects";
import { ALBUM_FETCH_REQUESTED_ACTION, albumFetchSucceeded, albumFetchFailed } from "../redux/action/album-action";
import { AnyAction } from "redux";
import Axios from "axios";
import { setLoading } from "../redux/action/application-action";

const requestAlbum = (id: number) =>
	Axios.get(`/api/album/${id}`)
		.then(x => x.data);

function *fetchAlbum(action: AnyAction) {
	try {
		yield put(setLoading(true));
		const album = yield call(requestAlbum, action.payload);
		yield put(albumFetchSucceeded(album));
	} catch (e) {
		yield put(albumFetchFailed(e && e.toString()))
	} finally {
		yield put(setLoading(false));
	}
}

export function *albumSaga() {
	yield takeLeading(ALBUM_FETCH_REQUESTED_ACTION, fetchAlbum);
}