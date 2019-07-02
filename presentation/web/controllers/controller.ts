import { RequestHandler, Router } from "express";

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';

export type ControllerAction<T extends Controller = Controller> = {
	method: HTTPMethod;
	path: string;
	handler: (controller: T) => RequestHandler;
}

const isControllerAction = (object: any): object is ControllerAction => {
	return typeof object === 'object' &&
		typeof object.method === 'string' &&
		typeof object.path === 'string' &&
		typeof object.handler !== 'undefined';
}

export class Controller {
	static attachRouter = (router: Router, path: string, controller: () => Controller, ...handlers: RequestHandler[]) => {
		const subRouter = Router();
		const controllerInstance = controller();
		for (const key in controllerInstance) {
			const action = controllerInstance[key];
			if (isControllerAction(action)) {
				subRouter[action.method](action.path, action.handler(controller()))
			}
		}
		router.use(path, [...handlers, subRouter]);
	}
}