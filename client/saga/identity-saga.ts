import { takeLeading, all, put, call } from "redux-saga/effects";
import { LOAD_IDENTITY_ACTION, LOAD_AUTHENTICATION_ACTION, SAVE_USER_ACTION, SET_USERNAME_ACTION, SET_ISADMIN_ACTION, LOGIN_REQUESTED_ACTION, SAVE_AUTH_TOKEN_ACTION, SAVE_ISADMIN_ACTION, SET_AUTH_TOKEN_ACTION } from "../redux/action/identity-action";
import { Action, AnyAction } from "redux";
import Axios from "axios";
import { setLoading } from "../redux/action/application-action";
import { UserRole } from "@/data/enums/user-enums";
import { ENABLE_SELECTION } from "../redux/action/photo-action";

type SuccessfullLoginPayload = {
	token: string;
	user: {
		email: string;
		role: UserRole;
	}
}

const requestLogin = (email: string, password: string) => Axios.post(`/auth/login`, { email, password })
	.then(x => x.data);

function *watchLoadIdentity() {
	yield takeLeading(LOAD_IDENTITY_ACTION, loadIdentity);
}

function *loadIdentity(action: Action) {
	if (typeof window !== 'undefined') {
		const username = localStorage.getItem('username');
		if (username && username.trim())
			yield put({ type: SET_USERNAME_ACTION, payload: username });
		const isAdmin = localStorage.getItem('is_admin');
		if (isAdmin !== undefined) {
			yield put({ type: SET_ISADMIN_ACTION, payload: JSON.parse(isAdmin) });
		}
			
	}
}

function *watchLoadAuthentication() {
	yield takeLeading(LOAD_AUTHENTICATION_ACTION, loadAuthentication);
}

function *loadAuthentication(action: Action) {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('token');
		if (token) {
			yield put({ type: SET_AUTH_TOKEN_ACTION, payload: token });
		}
	}
}

function *watchSaveAuthenticationToken() {
	yield takeLeading(SAVE_AUTH_TOKEN_ACTION, saveAuthenticationToken);
}

function *saveAuthenticationToken(action: AnyAction) {
	if (typeof window !== 'undefined') {
		const payload: SuccessfullLoginPayload = action.payload;
		localStorage.setItem('token', payload.token);
	}
}

function *watchSaveIsAdmin() {
	yield takeLeading(SAVE_ISADMIN_ACTION, saveIsAdmin);
}

function *saveIsAdmin(action: AnyAction) {
	if (typeof window !== 'undefined') {
		const payload: SuccessfullLoginPayload = action.payload;
		localStorage.setItem('is_admin', JSON.stringify(payload.user.role === UserRole.ADMIN));
	}
}

function *watchSaveIdentity() {
	yield takeLeading(SAVE_USER_ACTION, saveIdentity);
}

function *saveIdentity(action: AnyAction) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('username', action.payload);
	}
}

function *watchLogin() {
	yield takeLeading(LOGIN_REQUESTED_ACTION, login)
}

function *login(action: AnyAction) {
	yield put(setLoading(true))
	try {
		const {email, password} = action.payload;
		const response: SuccessfullLoginPayload = yield call(requestLogin, email, password);
		yield put({ type: SAVE_AUTH_TOKEN_ACTION, payload: response });
		yield put({ type: SAVE_ISADMIN_ACTION, payload: response });
	} catch {
		alert('Wrong credentials');
	} finally {
		yield put(setLoading(false));
	}
}

export function *identitySaga() {
	yield all([
		watchLoadAuthentication(),
		watchLoadIdentity(),
		watchSaveIdentity(),
		watchLogin(),
		watchSaveAuthenticationToken(),
		watchSaveIsAdmin(),
	]);
	
}