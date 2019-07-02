import { IdentityState, IdentityModuleOwnState } from "../state/identity-state";
import { IModule } from "redux-dynamic-modules";
import { authenticationReducer } from "../reducer/authentication-reducer";
import { identityReducer } from "../reducer/identity-reducer";
import { loadAuthentication, loadIdentity } from "../action/identity-action";
import { identitySaga } from "@/client/saga/identity-saga";
import { ISagaModule } from "redux-dynamic-modules-saga";

export const getIdentityModule = (): ISagaModule<IdentityModuleOwnState> => ({
	id: 'identity',
	reducerMap: {
		authentication: authenticationReducer,
		identity: identityReducer
	},
	sagas: [
		identitySaga
	],
	initialActions: [
		loadAuthentication(),
		loadIdentity()
	]
})