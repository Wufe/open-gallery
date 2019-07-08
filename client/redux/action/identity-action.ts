import { Action } from "redux";

export const LOAD_IDENTITY_ACTION = '@@Identity/LoadIdentity';

export const loadIdentity = (): Action => ({
	type: LOAD_IDENTITY_ACTION
});

export const LOAD_IDENTITY_FINISHED_ACTION = '@@Identity/LoadIdentityFinished';

export const loadIdentityFinished = (): Action => ({
	type: LOAD_IDENTITY_FINISHED_ACTION
});

export const LOAD_AUTHENTICATION_ACTION = '@@Authentication/LoadAuthentication';

export const loadAuthentication = (): Action => ({
	type: LOAD_AUTHENTICATION_ACTION
});

export const LOAD_AUTHENTICATION_FINISHED_ACTION = '@@Authentication/LoadAuthenticationFinished';

export const loadAuthenticationFinished = (): Action => ({
	type: LOAD_AUTHENTICATION_FINISHED_ACTION
});

export const SAVE_USER_ACTION = '@@Identity/SaveUser';
export const SET_USERNAME_ACTION = '@@Identity/SetUsername';

export const SAVE_AUTH_TOKEN_ACTION = '@@Authentication/SaveAuthToken';
export const SET_AUTH_TOKEN_ACTION = '@@Authentication/SetAuthToken';

export const SAVE_ISADMIN_ACTION = '@@Identity/SaveIsAdminAction';
export const SET_ISADMIN_ACTION = '@@Identity/SetIsAdminAction';

export const LOGIN_REQUESTED_ACTION = '@@Authentication/LoginRequested';