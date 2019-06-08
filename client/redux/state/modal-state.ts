export type ModalState = {
	open: boolean;
	name: string;
}

export const getInitialModalState = (): ModalState => ({
	open: true,
	name: ''
});