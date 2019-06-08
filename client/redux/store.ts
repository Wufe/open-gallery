import { IModuleStore, createStore } from "redux-dynamic-modules";
import { GlobalState } from "./state/global-state";
import { getModalModule } from "./module/modal-module";

export const store: IModuleStore<GlobalState> = createStore(
	{},

	[],

	[],

	getModalModule()
)