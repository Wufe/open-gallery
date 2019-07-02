import { Action } from "redux";

export const LOAD_IDENTITY_ACTION = '@@Identity/LoadIdentity';

export const loadIdentity = (): Action => ({
	type: LOAD_IDENTITY_ACTION
});

export const LOAD_IDENTITY_FINISHED_ACTION = '@@Identity/LoadIdentityFinished';

export const loadIdentityFinished = (): Action => ({
	type: LOAD_IDENTITY_FINISHED_ACTION
});

export const LOAD_AUTHENTICATION_ACTION = '@@Identity/LoadAuthentication';

export const loadAuthentication = (): Action => ({
	type: LOAD_AUTHENTICATION_ACTION
});

export const LOAD_AUTHENTICATION_FINISHED_ACTION = '@@Identity/LoadAuthenticationFinished';

export const loadAuthenticationFinished = (): Action => ({
	type: LOAD_AUTHENTICATION_FINISHED_ACTION
});