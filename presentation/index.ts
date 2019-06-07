import { shim } from './web/shim';
import { initApp } from './web/init/app';
import { initServer } from './web/init/server';
shim();

(async () => {

	await initServer();
	await initApp();

})();