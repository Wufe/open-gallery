import { ModalState, ModalModuleOwnState } from "./modal-state";
import { PhotoHandlingState, PhotoModuleOwnState } from "./photo-state";
import { IdentityModuleOwnState } from "./identity-state";

export type GlobalState = {
	identity: IdentityModuleOwnState;
	modal: ModalModuleOwnState;
	photo: PhotoModuleOwnState;
}