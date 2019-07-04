import * as React from 'react';
import { SubHeader } from '../../header/sub-header';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { PostState, PostModuleOwnState } from '@/client/redux/state/post-state';
import { withRouter, RouteComponentProps } from 'react-router';
import { POST_LOAD_REQUESTED_ACTION } from '@/client/redux/action/post-action';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getPostModule } from '@/client/redux/module/post-module';
import { PostModel } from '@/domain/models/post';

type OwnProps = {}

type StateProps = {
	loading: boolean;
	post: PostModel;
}

type DispatchProps = {
	loadPost: (id: number) => void;
}

type RouteProps = RouteComponentProps<{ id?: string }>;

type Props = OwnProps & StateProps & DispatchProps & RouteProps;

type State = {
	invalid: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PostModuleOwnState> = state => ({
	loading: state.post.loading,
	post: state.post.post,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	loadPost: id => dispatch({ type: POST_LOAD_REQUESTED_ACTION, payload: id })
});

const PostInternal = withRouter(connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			invalid: false
		};
	}

	componentWillMount() {
		const id = +this.props.match.params.id;
		if (!isNaN(id)) {
			this.props.loadPost(id);
			this.setState({ invalid: false });
		} else {
			this.setState({ invalid: true });
		}
	}

	render() {
		return <>
			<SubHeader title="Post" />
			{this.props.loading && <SubHeader title="Caricamento.." />}
			{!this.props.loading && this.state.invalid && <SubHeader title="Post non trovato" />}
			{!this.props.loading && !this.state.invalid && <SubHeader title={this.props.post.description} />}
		</>;
	}
}))

const Post = () => <DynamicModuleLoader modules={[getPostModule()]}>
	<PostInternal />
</DynamicModuleLoader>

export default Post;