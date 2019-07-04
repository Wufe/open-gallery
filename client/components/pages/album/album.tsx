import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { GlobalState } from '@/client/redux/state/global-state';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getAlbumModel } from '@/client/redux/module/album-module';
import { SubHeader } from '../../header/sub-header';
import { requestAlbumFetch } from '@/client/redux/action/album-action';
import { ApplicationState } from '@/client/redux/state/application-state';

type OwnProps = {}

type StateProps = {
	loading: boolean;
}

type DispatchProps = {
	loadAlbum: (id: number) => void;
}

type RouteProps = RouteComponentProps<{ id?: string }>;

type Props = OwnProps & StateProps & DispatchProps & RouteProps;

type State = {
	invalid: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, ApplicationState> = state => ({
	loading: state.loading,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	loadAlbum: id => dispatch(requestAlbumFetch(id))
});

const Album = withRouter(connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			invalid: false
		};
	}

	componentDidMount() {
		const id = +this.props.match.params.id;
		if (!isNaN(id)) {
			this.props.loadAlbum(id);
			this.setState({ invalid: false });
		} else {
			this.setState({ invalid: true });
		}
	}

	render() {
		return <>
			<DynamicModuleLoader modules={[getAlbumModel()]}>
				{this.state.invalid && <SubHeader title="Album non valido" />}
				{this.props.loading && <SubHeader title="Caricamento" />}
				{!this.props.loading && <h1>Album {this.props && this.props.match.params.id }</h1>}
			</DynamicModuleLoader>
		</>;
	}
}));

export default Album;