export type ApplicationModuleOwnState = {
	application: ApplicationState;
}

export type ApplicationState = {
	loading: boolean;
}

export const getInitialApplicationState = (): ApplicationState => ({
	loading: false
});