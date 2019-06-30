import { shim } from './shim';
import { initServer } from './init/server';
import { initBackEndApp } from './init/backend';
shim();

(async () => {
	await initServer();
	await initBackEndApp();
})();