import { IdentityState, getInitialIdentityState } from "../state/identity-state";
import { Action } from "redux";

export const identityReducer = (state: IdentityState = getInitialIdentityState(), action: Action) => {
	switch (action.type) {
		default:
			return state;
	}
}