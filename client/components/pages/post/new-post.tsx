import * as React from 'react';
import { PhotoModel } from '@/domain/models/photo';
import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import { UploadPostState, PostModuleOwnState } from '@/client/redux/state/post-state';
import { UPLOAD_POST_REQUESTED_ACTION } from '@/client/redux/action/post-action';
import { SubHeader } from '../../header/sub-header';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getPhotoModule } from '@/client/redux/module/photo-module';
import { getPostModule } from '@/client/redux/module/post-module';
import { GlobalState } from '@/client/redux/state/global-state';
import Dropzone from 'react-dropzone';
import './new-post.scss';
import { ApplicationModuleOwnState } from '@/client/redux/state/application-state';
import { PostInputModel } from '@/client/saga/post-saga';
import { IdentityModuleOwnState } from '@/client/redux/state/identity-state';
import { SAVE_USER_ACTION } from '@/client/redux/action/identity-action';

type OwnProps = {}

type StateProps = {
	loading: boolean;
	photos: PhotoModel[];
	username: string;
}

type DispatchProps = {
	uploadPost: (post: PostInputModel) => void;
	saveUser: (username: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

type State = {
	photosToBeUploaded: File[];
	anonym: boolean;
	username: string;
	description: string;
	descriptionWarning: boolean;
	usernameWarning: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, PostModuleOwnState & ApplicationModuleOwnState & IdentityModuleOwnState> = state => ({
	loading: state.application.loading,
	photos: state.upload.photos,
	username: state.identity.name || '',
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
	uploadPost: post => dispatch({ type: UPLOAD_POST_REQUESTED_ACTION, payload: post }),
	saveUser: username => dispatch({ type: SAVE_USER_ACTION, payload: username })
});

const NewPostInternal = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

	formRef: React.RefObject<HTMLFormElement> = React.createRef();
	usernameRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: Props) {
		super(props);
		this.state = {
			photosToBeUploaded: [],
			anonym: false,
			username: props.username,
			description: '',
			descriptionWarning: false,
			usernameWarning: false,
		};
	}

	onAnonymChange = (event: React.ChangeEvent) => {
		const checked = (event.target as HTMLInputElement).checked;
		this.setState({ anonym: checked });
		if (checked) {
			this.setState({ username: '', usernameWarning: false });
		}
	}

	resetForm = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({ anonym: false, photosToBeUploaded: [], descriptionWarning: false, usernameWarning: false, description: '', username: '' });
		if (this.formRef && this.formRef.current) {
			this.formRef.current.reset();
		}
	}

	upload = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		
		if (!this.state.anonym && (!this.state.username || !this.state.username.trim())) {
			this.setState({ usernameWarning: true });
			if (this.usernameRef && this.usernameRef.current) {
				this.usernameRef.current.scrollIntoView();
				this.usernameRef.current.focus();
			}
		} else {
			if (this.state.username) {
				this.props.saveUser(this.state.username);
			}
			this.props.uploadPost({
				description: this.state.description || '',
				files: this.state.photosToBeUploaded,
				username: this.state.username,
			});
		}
	}

	onUsernameChange = (event: React.ChangeEvent) => {
		this.setState({ username: (event.target as HTMLInputElement ).value, usernameWarning: false })
	}

	onDescriptionChange = (event: React.ChangeEvent) => {
		this.setState({ description: (event.target as HTMLTextAreaElement).value })
	}

	render() {
		return <div className="new-post__component">
			<SubHeader title="Nuovo post" />
			<form className="new-post__form" ref={this.formRef}>
				<div className={`form__content ${this.props.loading ? 'form__content--loading' : ''}`}>
					<div className="form__row">
						<div className="form-field__description">
							<span>Username</span>
							<label>
								<input type="checkbox" onChange={this.onAnonymChange} checked={this.state.anonym} />
								<span>Anonimo</span>
							</label>
						</div>
						<div className="form-field__input">
							<input className={`${this.state.usernameWarning ? 'warning' : ''}`} ref={this.usernameRef} type="text" value={this.state.username} placeholder="Inserisci il tuo nome" disabled={this.state.anonym} onChange={this.onUsernameChange} />
							
						</div>
						{this.state.usernameWarning && <div className="form-row__warning">Inserisci il tuo nome</div>}
					</div>
					<div className="form__row">
						<div className="form-field__description">Testo</div>
						<div className="form-field__input">
							<textarea onChange={this.onDescriptionChange} value={this.state.description} rows={10} style={{width: '100%'}} />
						</div>
					</div>
					{this.state.photosToBeUploaded.length > 0 &&
						<>
							<div className="form__row">
								<div className="form-field__description form-field__description--big">File pronti al caricamento</div>
							</div>
							{this.state.photosToBeUploaded.map((file, k) =>
								<div className="files-list__list-item" key={k}>
									<div className="file__name">{file.name}</div>
								</div>)}
							<div className="files-list__action-container">
								<button className="action--undo" onClick={this.resetForm}>Annulla</button>
								<button className="action--upload" onClick={this.upload}>Carica</button>
							</div>
						</>}
				</div>
				{/* {this.props.loading && <div className="form-loading__span">Caricamento in corso</div>} */}
			</form>
			
			{!this.props.loading && <Dropzone accept={'image/jpeg, image/png'} onDrop={acceptedFiles => {
				this.setState({
					photosToBeUploaded: [
						...this.state.photosToBeUploaded,
						...acceptedFiles
					]
				})
			}}>
				{({getRootProps, getInputProps}) => (
					<section className="drop-zone__section">
						<div className="drop-zone__input-container" {...getRootProps()}>
							<input {...getInputProps()} />
							<p>Trascina i file o clicca per selezionare</p>
						</div>
					</section>
				)}
			</Dropzone>}
		</div>
	}
})

const NewPost = () => <DynamicModuleLoader modules={[getPostModule()]}>
	<NewPostInternal />
</DynamicModuleLoader>;

export default NewPost;