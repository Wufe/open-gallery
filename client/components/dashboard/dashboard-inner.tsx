import * as React from 'react';
import { SubHeader } from '../header/sub-header';
import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import { PhotoModuleOwnState } from '@/client/redux/state/photo-state';
import { PostModuleOwnState } from '@/client/redux/state/post-state';
import { PostModel } from '@/domain/models/post';
import { LOAD_POST_BEFORE_ACTION, LOAD_POST_AFTER_ACTION } from '@/client/redux/action/post-action';
import { ApplicationModuleOwnState } from '@/client/redux/state/application-state';
import loadable from '@loadable/component';

import './dashboard.scss';
import DashboardPost from './dashboard-post';

type OwnProps = {}

type StateProps = {
	posts: PostModel[];
	loading: boolean;
}

type DispatchProps = {
	loadBefore: (uuid: string) => void;
	loadAfter: (uuid: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const LazyRepo = loadable.lib(() => import('@/client/repo/lazy-load-repo'), {
	ssr: false
});

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PostModuleOwnState & ApplicationModuleOwnState> = state => ({
	posts: state.post.posts,
	loading: state.application.loading,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	loadBefore: uuid => dispatch({ type: LOAD_POST_BEFORE_ACTION, payload: uuid }),
	loadAfter: uuid => dispatch({ type: LOAD_POST_AFTER_ACTION, payload: uuid }),
});

type State = {
	timer: any | null;
}

const POLLING_INTERVAL = 60000;

const DashboardInner = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = { timer: null };
	}

	componentWillMount() {
		this.props.loadAfter('');
	}

	componentDidMount() {
		window.addEventListener('scroll', this.onScroll);
		if (!this.state.timer) {
			this.setState({ timer: setInterval(this.checkNew, POLLING_INTERVAL) });
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
		if (this.state.timer) {
			clearInterval(this.state.timer);
			this.setState({ timer: null });
		}
	}

	checkNew = () => {
		let firstUUID = '';
		if (this.props.posts.length)
			firstUUID = this.props.posts[0].uuid;
		this.props.loadBefore(firstUUID);
	}

	onScroll = (event: Event) => {
		const totalScroll = window.document.body.scrollHeight;
		const currentScroll = window.scrollY;
		const percentage = (currentScroll / totalScroll) * 100;
		if (percentage > 80 && !this.props.loading) {
			let lastUUID = '';
			if (this.props.posts.length)
				lastUUID = this.props.posts[this.props.posts.length -1].uuid;
			this.props.loadAfter(lastUUID);
		}
	}

	render() {
		return <>
			<LazyRepo>
				{lazy => {
					const instance = lazy.buildLazy();
					return <>
						{this.props.posts && this.props.posts.length > 0 && <div className="posts">
							{this.props.posts.map((post, index) => <React.Fragment key={index}>
								<DashboardPost key={index} post={post} lazyLoadRepo={instance} />
								{index < this.props.posts.length -1 && <div className="post__separator"></div>}
							</React.Fragment>)}
						</div>}
						{(!this.props.posts || !this.props.posts.length) && !this.props.loading && <SubHeader title="Attualmente non ci sono post da mostrare." />}
					</>;
				}}
			</LazyRepo>
		</>;
	}
});

export default DashboardInner;