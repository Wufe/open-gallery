import { ApplicationState, getInitialApplicationState } from "../state/application-state";
import { AnyAction } from "redux";
import { SET_LOADING_ACTION, SEED_APPLICATION } from "../action/application-action";

export const applicationReducer = (state: ApplicationState = getInitialApplicationState(), action: AnyAction): ApplicationState => {
	switch (action.type) {
		case SET_LOADING_ACTION:
			const payload = action.payload as boolean;
			return {
				...state,
				loading: payload,
			}
			break;
		case SEED_APPLICATION:
			return state;
		default:
			return state;
	}
}