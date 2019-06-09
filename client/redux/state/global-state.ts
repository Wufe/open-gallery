import { ModalState, ModalModuleOwnState } from "./modal-state";
import { PhotoHandlingState, PhotoModuleOwnState } from "./photo-state";

export type GlobalState = {
	modal: ModalModuleOwnState;
	photo: PhotoModuleOwnState;
}