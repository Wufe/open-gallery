import { IModule } from 'redux-dynamic-modules';
import { ModalState, ModalModuleOwnState } from "../state/modal-state";
import { GlobalState } from '../state/global-state';
import { modalReducer } from '../reducer/modal-reducer';

export const getModalModule = (): IModule<ModalModuleOwnState> => ({
	id: 'modal',
	reducerMap: {
		modalHandling: modalReducer
	}
})