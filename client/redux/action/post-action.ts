import { AnyAction } from "redux";

export const UPLOAD_POST_RESET_ACTION = '@@UploadPost/Reset';

export const resetUploadPost = (): AnyAction => ({
	type: UPLOAD_POST_RESET_ACTION,
});

export const UPLOAD_POST_REQUESTED_ACTION = '@@UploadPost/UploadPhotoRequested';
export const UPLOAD_POST_SUCCEEDED_ACTION = '@@UploadPost/UploadPhotoSucceeded';
export const UPLOAD_POST_FAILED_ACTION = '@@UploadPost/UploadPhotoFailed';

export const POST_LOAD_REQUESTED_ACTION = '@@Post/LoadRequested';
export const POST_LOAD_SUCCEEDED_ACTION = '@@Post/LoadSucceeded';
export const POST_LOAD_FAILED_ACTION = '@@Post/LoadFailed';

export const LOAD_POST_BEFORE_ACTION = '@@Post/LoadBefore';
export const LOAD_POST_AFTER_ACTION = '@@Post/LoadAfter';

export const LOADED_POST_BEFORE_ACTION = '@@Post/LoadedBefore';
export const LOADED_POST_AFTER_ACTION = '@@Post/LoadedAfter';