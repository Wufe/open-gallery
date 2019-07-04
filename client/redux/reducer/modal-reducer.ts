import { ModalState, getInitialModalState } from "../state/modal-state";
import { Action, AnyAction } from "redux";
import { OPEN_MODAL_ACTION, CLOSE_MODAL_ACTION } from "../action/modal-action";

export const modalReducer = (state: ModalState = getInitialModalState(), action: AnyAction) => {
	switch (action.type) {
		case OPEN_MODAL_ACTION:
			return {
				...state,
				open: true,
				name: action.payload,
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