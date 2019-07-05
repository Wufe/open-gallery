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
import { LazyLoadImage } from '../lazy-load/lazy-load-image';
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

const DashboardInner = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {

	componentWillMount() {
		this.props.loadAfter('');
	}

	componentDidMount() {
		window.addEventListener('scroll', this.onScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
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
							{this.props.posts.map((post, index) => <DashboardPost key={index} post={post} lazyLoadRepo={instance} />)}
						</div>}
						{(!this.props.posts || !this.props.posts.length) && !this.props.loading && <SubHeader title="Attualmente non ci sono post da mostrare." />}
					</>;
				}}
			</LazyRepo>
		</>;
	}
});

export default DashboardInner;