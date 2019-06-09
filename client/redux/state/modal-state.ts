
export type ModalModuleOwnState = {
	modalHandling: ModalState;
}

export type ModalState = {
	open: boolean;
	name: string;
}

export const getInitialModalState = (): ModalState => ({
	open: false,
	name: ''
});