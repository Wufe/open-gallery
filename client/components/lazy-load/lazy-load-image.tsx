import * as React from 'react';
import { LazyLoadRepo } from '@/client/repo/lazy-load-repo';
import './lazy-load-image.scss';

export type LazyLoadObject = {
	element: HTMLElement;
	intersecting(): void;
}

type Props = {
	imgStyle?: React.CSSProperties;
	imgClass?: string;
	intersectionElementRef?: React.RefObject<HTMLElement>;
	useSelfRef: boolean;
	lazy: LazyLoadRepo;
	src: string;
}

type State = {
	useSrc: boolean;
	visible: boolean;
	intersectionElement?: HTMLElement;
}

export class LazyLoadImage extends React.Component<Props, State> {

	private _imageElement: HTMLImageElement;
	private _destroyed = false;

	constructor(props: Props) {
		super(props);
		this.state = { useSrc: false, visible: false, intersectionElement: (this.props.intersectionElementRef && this.props.intersectionElementRef.current) || undefined };
	}

	get element() {
		return this.state.intersectionElement;
	}

	intersecting() {
		this._imageElement.onload = () => {
			if (this._destroyed) return;
			
			this.setState({ visible: true });
			this._imageElement.onload = undefined;
		}
		this.setState({
			useSrc: true
		});
	}

	register(intersectionElement: HTMLElement) {
		if (!this.state.intersectionElement) {
			this.setState({
				intersectionElement
			}, () => this.props.lazy.add(this));
		}
	}

	componentWillUnmount() {
		this._destroyed = true;
		this.props.lazy.remove(this);
	}

	imageRef = (element: HTMLImageElement) => {
		this._imageElement = element;
		if (this.props.useSelfRef)
			this.register(element);
	}

	render() {
		return <img
			className={`lazy__image ${this.state.visible ? 'lazy__image--visible' : ''} ${this.props.imgClass || ''}`}
			style={{
				...(this.props.imgStyle || {}),
			}}
			ref={this.imageRef}
			src={this.state.useSrc ? this.props.src : null} />
	}
}