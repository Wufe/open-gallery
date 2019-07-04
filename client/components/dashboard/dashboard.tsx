import * as React from 'react';
import { Header } from '../header/header';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { SubHeader } from '../header/sub-header';
import { getPostModule } from '@/client/redux/module/post-module';
import loadable from '@loadable/component';

type OwnProps = {}

type StateProps = {}

type DispatchProps = {}

type Props = OwnProps & StateProps & DispatchProps;

const DashboardInner = loadable(() => import('@/client/components/dashboard/dashboard-inner'), {
	ssr: false
});

class Dashboard extends React.Component {
	render() {
		return <>
			<DynamicModuleLoader modules={[getPostModule()]}>
				<DashboardInner />
			</DynamicModuleLoader>
		</>;
	}
}

export default Dashboard;