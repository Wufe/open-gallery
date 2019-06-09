import * as React from 'react';
import './layout.scss';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { GlobalState } from '@/client/redux/state/global-state';
import { openModal, closeModal } from '@/client/redux/action/modal-action';
import { Header } from '../header/header';
import { ModalState, ModalModuleOwnState } from '@/client/redux/state/modal-state';

type OwnProps = {
	routes: JSX.Element;
}

type StateProps = {
	isOpen: boolean;
}

type DispatchProps = {
	open: () => void;
	close: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, ModalModuleOwnState> = state => ({
	isOpen: state.modalHandling.open
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	open: () => dispatch(openModal()),
	close: () => dispatch(closeModal())
});

export const Layout = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	onModalClick = (event: React.MouseEvent) => {
		event.stopPropagation();
	}

	onBackdropClick = (event: React.MouseEvent) => {
		this.props.close();
	}

	render = () =>
		<div className="layout__component">
			<div
				className={`layout__main-content ${this.props.isOpen ? 'layout__main-content--blur' : ''}`}>
				<Header />
				{this.props.routes}
			</div>
			{this.props.isOpen && <div
				className={`layout__modals-container`}
				onClick={this.onBackdropClick}>
				<div
					className="modal"
					onClick={this.onModalClick}></div>
			</div>}
		</div>;
})