import { IModuleStore, createStore } from "redux-dynamic-modules";
import { GlobalState } from "./state/global-state";
import { getSagaExtension } from 'redux-dynamic-modules-saga';
import createSagaMiddleware from "@redux-saga/core";
import { photoSaga } from "../saga/photo-saga";
import { applyMiddleware } from "redux";

// const sagaMiddleware = createSagaMiddleware();


// const appliedSagaMiddleware = applyMiddleware(sagaMiddleware);
// sagaMiddleware.run(photoSaga);

export const store: IModuleStore<GlobalState> = createStore(
	{},

	[],

	[getSagaExtension()]
)

