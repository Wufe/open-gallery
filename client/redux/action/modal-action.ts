import { Action, AnyAction } from "redux";

export const OPEN_MODAL_ACTION = 'modal/OPEN';

export const openModal = (name: string): AnyAction => ({
	type: OPEN_MODAL_ACTION,
	payload: name
});

export const CLOSE_MODAL_ACTION = 'modal/CLOSE';

export const closeModal = (): Action => ({
	type: CLOSE_MODAL_ACTION
});