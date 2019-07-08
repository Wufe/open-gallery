import * as React from 'react';
import './login.scss';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getIdentityModule } from '@/client/redux/module/identity-module';
import { SubHeader } from '../../header/sub-header';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { LOGIN_REQUESTED_ACTION } from '@/client/redux/action/identity-action';

type OwnProps = {}

type DispatchProps = {
	requestLogin: (email: string, password: string) => void;
}

type Props = OwnProps & DispatchProps;

type State = {
	email: string;
	password: string;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	requestLogin: (email, password) => dispatch({ type: LOGIN_REQUESTED_ACTION, payload: { email, password } }),
});

const InnerLogin = connect(null, mapDispatchToProps)(class extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = { email: '', password: ''}
	}

	onEmailChange = (event: React.ChangeEvent) => {
		this.setState({
			email: (event.target as HTMLInputElement).value
		});
	}

	onPasswordChange = (event: React.ChangeEvent) => {
		this.setState({
			password: (event.target as HTMLInputElement).value
		});
	}

	login = () => {
		const {email, password} = this.state;
		this.props.requestLogin(email, password);
		this.setState({ email: '', password: '' });
	}

	render = () => <div className="login__component">
		<SubHeader title="Accesso riservato" />
		<div className="login__form">
			<div className="form__row">
				<div className="form__input">
					<div className="form__description">Email</div>
					<input type="text" onChange={this.onEmailChange} value={this.state.email} />
				</div>
			</div>

			<div className="form__row">
				<div className="form__input">
					<div className="form__description">Password</div>
					<input type="password" onChange={this.onPasswordChange} value={this.state.password} />
				</div>
			</div>

			<div className="form__row">
				<button className="form__button" onClick={this.login}>Accedi</button>
			</div>
		</div>
	</div>
});

const Login = () =>
	<DynamicModuleLoader modules={[getIdentityModule()]}>
		<InnerLogin />
	</DynamicModuleLoader>

export default Login;