import * as React from 'react';
import "./entry.scss";
import { renderRoutes } from 'react-router-config';
import { routes } from '../router/routes';
import { Layout } from './layout/layout';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getModalModule } from '../redux/module/modal-module';
import { getIdentityModule } from '../redux/module/identity-module';
import { getApplicationModule } from '../redux/module/application-module';

const Entry = () => <Provider store={store}>
	<DynamicModuleLoader modules={[getApplicationModule(), getModalModule(), getIdentityModule()]}>
		<Layout routes={renderRoutes(routes)} />
	</DynamicModuleLoader>
</Provider>;

export default Entry;