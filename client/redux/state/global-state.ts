import { ModalState, ModalModuleOwnState } from "./modal-state";
import { PhotoHandlingState, PhotoModuleOwnState } from "./photo-state";
import { IdentityModuleOwnState } from "./identity-state";
import { AlbumModuleOwnState } from "./album-state";
import { ApplicationModuleOwnState } from "./application-state";
import { PostModuleOwnState } from "./post-state";

export type GlobalState = {
	application: ApplicationModuleOwnState;
	album: AlbumModuleOwnState;
	identity: IdentityModuleOwnState;
	modal: ModalModuleOwnState;
	photo: PhotoModuleOwnState;
	post: PostModuleOwnState;
}