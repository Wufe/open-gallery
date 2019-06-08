import { IModule } from 'redux-dynamic-modules';
import { ModalState } from "../state/modal-state";
import { GlobalState } from '../state/global-state';
import { modalReducer } from '../reducer/modal-reducer';

export const getModalModule = (): IModule<GlobalState> => ({
	id: 'modal',
	reducerMap: {
		modal: modalReducer
	}
})