import * as React from 'react';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import { PhotoProps, RenderImageProps } from 'react-photo-gallery';
import { LoadableLibrary } from '@loadable/component';
import './lazy-load-image.scss';
import { PhotoAdditionalProperties, PhotoModuleOwnState, Photo } from '@/client/redux/state/photo-state';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { selectPhoto, unselectPhoto } from '@/client/redux/action/photo-action';
import { PhotoModel } from '@/domain/models/photo';

export type CustomPhotoProps = Photo & {
	lazy?: LazyLoadRepo;
};

type OwnProps = RenderImageProps<CustomPhotoProps> & {};

type StateProps = {
	selectionEnabled: boolean;
};

type DispatchProps = {
	select: (uuid: string) => void;
	unselect: (uuid: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

type State = {
	useSrc: boolean;
	visible: boolean;
}

const Checkmark = ({ selected }) => (
	<div
		style={(selected
				? { left: "4px", top: "4px", position: 'absolute', zIndex: "1" }
				: { display: "none" }) as React.CSSProperties}>
		<svg
			style={{ fill: "white", position: "absolute" }}
			width="24px"
			height="24px">
			<circle cx="12.5" cy="12.2" r="8.292" />
		</svg>
		<svg
			style={{ fill: "#06befa", position: "absolute" }}
			width="24px"
			height="24px">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
		</svg>
	</div>
);

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PhotoModuleOwnState> = state => ({
	selectionEnabled: state.photoSettings.selection.enabled
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	select: uuid => dispatch(selectPhoto(uuid)),
	unselect: uuid => dispatch(unselectPhoto(uuid))
});

export type LazyLoadObject = {
	element: HTMLElement;
	intersecting(): void;
}

export const LazyLoadImageContainer = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

	private _imageRef: React.RefObject<HTMLImageElement>;
	private _containerRef: React.RefObject<HTMLDivElement>;
	private _destroyed = false;

	constructor(props: Props) {
		super(props);
		this.state = { useSrc: false, visible: false };
		this._imageRef = React.createRef();
		this._containerRef = React.createRef();
	}

	get element() {
		const { current } = this._containerRef;
		return current;
	}

	intersecting() {
		this._imageRef.current.onload = () => {
			if (this._destroyed) return;
			this.setState({ visible: true });
			this._imageRef.current.onload = undefined;
		}
		this.setState({
			useSrc: true
		});
	}

	componentDidMount() {
		this.props.photo.lazy.add(this);
	}

	componentWillUnmount() {
		this._destroyed = true;
		this.props.photo.lazy.remove(this);
	}

	onContainerClick = () => {
		if (!this.props.selectionEnabled)
			return;
		if (this.props.photo.selected) {
			this.props.unselect(this.props.photo.uuid);
		} else {
			this.props.select(this.props.photo.uuid);
		}
	}

	render = () => {
		const containerStyle: React.CSSProperties = {}
		if (this.props.direction === 'column') {
			containerStyle.position = 'absolute';
			containerStyle.left = `${this.props.left}px`;
			containerStyle.top = `${this.props.top}px`;
		}

		const imgStyle: React.CSSProperties = {};
		const scaleX = (100 - (30 / this.props.photo.width) * 100) / 100;
		const scaleY = (100 - (30 / this.props.photo.height) * 100) / 100;
		if (this.props.photo.selected)
			imgStyle.transform = `translateZ(0px) scale3d(${scaleX}, ${scaleY}, 1)`;

		return <div ref={this._containerRef} className={`lazy__container ${this.props.selectionEnabled ? 'lazy__container--selectable' : ''}`} style={{
			...containerStyle,
			width: this.props.photo.width,
			height: this.props.photo.height
		}} onClick={this.onContainerClick}>
			<Checkmark selected={this.props.photo.selected} />
			<img className={`lazy__image ${this.state.visible ? 'lazy__image--visible' : ''} ${this.props.photo.selected ? `lazy__image--selected` : ''}`} style={{
				...imgStyle,
				width: this.props.photo.width,
				height: this.props.photo.height
			}} ref={this._imageRef} src={this.state.useSrc ? this.props.photo.src : null} />
		</div>
	}
})