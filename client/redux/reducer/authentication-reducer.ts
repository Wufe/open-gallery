import { AuthenticationState, getInitialAuthenticationState } from "../state/identity-state";
import { Action, AnyAction } from "redux";
import { SET_AUTH_TOKEN_ACTION } from "../action/identity-action";

export const authenticationReducer = (state: AuthenticationState = getInitialAuthenticationState(), action: AnyAction) => {
	switch (action.type) {
		case SET_AUTH_TOKEN_ACTION:
			return {
				...state,
				token: action.payload,
			} as AuthenticationState;
		default:
			return state;
	}
}