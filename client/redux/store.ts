import { IModuleStore, createStore } from "redux-dynamic-modules";
import { GlobalState } from "./state/global-state";
import { getSagaExtension } from 'redux-dynamic-modules-saga';

export const store: IModuleStore<GlobalState> = createStore({
	extensions: [getSagaExtension()]
});

