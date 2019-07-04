import { takeLeading, all, put } from "redux-saga/effects";
import { LOAD_IDENTITY_ACTION, LOAD_AUTHENTICATION_ACTION, SAVE_USER_ACTION, SET_USERNAME_ACTION } from "../redux/action/identity-action";
import { Action, AnyAction } from "redux";

function *watchLoadIdentity() {
	yield takeLeading(LOAD_IDENTITY_ACTION, loadIdentity);
}

function *loadIdentity(action: Action) {
	if (typeof window !== 'undefined') {
		const username = localStorage.getItem('username');
		if (username && username.trim())
			yield put({ type: SET_USERNAME_ACTION, payload: username });
	}
}

function *watchLoadAuthentication() {
	yield takeLeading(LOAD_AUTHENTICATION_ACTION, loadAuthentication);
}

function *loadAuthentication(action: Action) {
}

function *watchSaveIdentity() {
	yield takeLeading(SAVE_USER_ACTION, saveIdentity);
}

function *saveIdentity(action: AnyAction) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('username', action.payload);
	}
}

export function *identitySaga() {
	yield all([
		watchLoadAuthentication(),
		watchLoadIdentity(),
		watchSaveIdentity(),
	]);
	
}