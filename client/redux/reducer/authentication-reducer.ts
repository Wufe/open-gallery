import { AuthenticationState, getInitialAuthenticationState } from "../state/identity-state";
import { Action } from "redux";

export const authenticationReducer = (state: AuthenticationState = getInitialAuthenticationState(), action: Action) => {
	switch (action.type) {
		default:
			return state;
	}
}