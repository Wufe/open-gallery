import { IModule } from "redux-dynamic-modules";
import { ApplicationModuleOwnState } from "../state/application-state";
import { applicationReducer } from "../reducer/application-reducer";
import { seedApplication } from "../action/application-action";

export const getApplicationModule = (): IModule<ApplicationModuleOwnState> => ({
	id: 'application',
	reducerMap: {
		application: applicationReducer,
	},
	initialActions: [seedApplication()]
})