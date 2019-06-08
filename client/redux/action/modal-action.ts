import { Action } from "redux";

export const OPEN_MODAL_ACTION = 'modal/OPEN';

export const openModal = (): Action => ({
	type: OPEN_MODAL_ACTION
});

export const CLOSE_MODAL_ACTION = 'modal/CLOSE';

export const closeModal = (): Action => ({
	type: CLOSE_MODAL_ACTION
});