import { shim } from './shim';
import { initServer } from './init/server';
import { initFrontendProxyApp } from './init/frontend-proxy';
shim();

(async () => {
	await initFrontendProxyApp();
})();