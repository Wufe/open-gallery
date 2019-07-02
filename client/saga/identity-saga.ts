import { takeLeading, all } from "redux-saga/effects";
import { LOAD_IDENTITY_ACTION, LOAD_AUTHENTICATION_ACTION } from "../redux/action/identity-action";
import { Action } from "redux";

function *watchLoadIdentity() {
	yield takeLeading(LOAD_IDENTITY_ACTION, loadIdentity);
}

function *loadIdentity(action: Action) {
	console.log('load identity');
}

function *watchLoadAuthentication() {
	yield takeLeading(LOAD_AUTHENTICATION_ACTION, loadAuthentication);
}

function *loadAuthentication(action: Action) {
	console.log('load authentication');
}

export function *identitySaga() {
	yield all([
		watchLoadAuthentication(),
		watchLoadIdentity()
	]);
	
}