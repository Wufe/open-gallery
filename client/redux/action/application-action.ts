import { AnyAction, Action } from "redux";

export const SET_LOADING_ACTION = '@@Application/SetLoading';

export const setLoading = (loading: boolean): AnyAction => ({
	type: SET_LOADING_ACTION,
	payload: loading,
});

export const SEED_APPLICATION = '@@Application/Seed';

export const seedApplication = (): Action => ({
	type: SEED_APPLICATION,
});