export type IdentityModuleOwnState = {
	authentication: AuthenticationState;
	identity: IdentityState;
}

export type AuthenticationState = {
	token: string;
}

export type IdentityState = {
	isAdmin: boolean;
	name: string;
}

export const getInitialIdentityState = (): IdentityState => ({
	isAdmin: false,
	name: ''
});

export const getInitialAuthenticationState = (): AuthenticationState => ({
	token: ''
});