import { ModalState, getInitialModalState } from "../state/modal-state";
import { Action } from "redux";
import { OPEN_MODAL_ACTION, CLOSE_MODAL_ACTION } from "../action/modal-action";

export const modalReducer = (state: ModalState = getInitialModalState(), action: Action) => {
	switch (action.type) {
		case OPEN_MODAL_ACTION:
			return {
				...state,
				open: true
			};
		case CLOSE_MODAL_ACTION:
			return {
				...state,
				open: false
			};
		default:
			return state;
	}
}