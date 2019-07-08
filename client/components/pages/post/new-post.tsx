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
import { withRouter, RouteComponentProps } from 'react-router';
import { PhotoIcon } from '../../icons/photo-icon';

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

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps;

type State = {
	photosToBeUploaded: ExtendedFile[];
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

type ExtendedFile = File & {
	preview?: string;
}

const NewPostInternal = withRouter(connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<Props, State> {

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

	onDrop = (files: File[]) => {
		const readerPromises = files
			.map((file: ExtendedFile) => {
				return new Promise<ExtendedFile>(resolve => {
					const reader = new FileReader();

					reader.onabort = () => resolve(file)
					reader.onerror = () => resolve(file)
					reader.onload = () => {
						const binaryStr = reader.result;
						file.preview = binaryStr.toString();
						resolve(file)
					}
					reader.readAsDataURL(file);
				});
			});
		Promise.all(readerPromises)
			.then(extendedFiles => {
				this.setState({
					photosToBeUploaded: [
						...this.state.photosToBeUploaded,
						...extendedFiles
					] 
				})
			})
	}

	render() {
		const photos = this.state.photosToBeUploaded;
		return <div className="new-post__component">
			<div className="new-post__header">Nuovo post</div>
			<form className="new-post__form" ref={this.formRef}>
				<div className="form__row">
					<div className={`form-field__input ${this.state.usernameWarning ? 'warning' : ''}`}>
						<input className={`form-field__username`} ref={this.usernameRef} type="text" value={this.state.username} placeholder="Inserisci il tuo nome" disabled={this.state.anonym} onChange={this.onUsernameChange} />
					</div>
					{this.state.usernameWarning && <div className="form-row__warning">Inserisci il tuo nome</div>}
				</div>
				<div className="form__row">
					<div className="form-field__input">
						<textarea
							onChange={this.onDescriptionChange}
							value={this.state.description}
							rows={5}
							placeholder="Aggiungi un commento..." />
					</div>
				</div>
			</form>
			{photos.length > 0 && <div className="form-action__container">
				<button className="form-action form-action__primary" onClick={this.upload}>Pubblica</button>
			</div>}
			{!this.props.loading && <Dropzone accept={'image/jpeg, image/png'} onDrop={this.onDrop}>
				{({getRootProps, getInputProps}) => (
					<section className={`drop-zone__section ${photos.length ? 'drop-zone__section--small drop-zone__section--bordered' : ''}`} {...getRootProps()}>
						<div className={`drop-zone__input-container ${photos.length ? 'drop-zone__input-container--small' : ''}`} >
							<input {...getInputProps()} />
							<PhotoIcon />
							{photos.length > 0 && <p>Aggiungi altre foto</p>}
							{photos.length === 0 && <p>Clicca per aggiungere foto</p>}
						</div>
					</section>
				)}
			</Dropzone>}
			{photos.length >  0 && <div className="form-action__container">
				<button className="form-action form-action__cancel" onClick={this.resetForm}>Annulla</button>
			</div>}
			{photos.length > 0 && <div className={`new-post__files ${photos.length === 1 ? 'new-post__files--single' : ''}`}>
				{photos.map((photo, index) => <div className="new-post__file" key={index}>
					<img src={photo.preview} alt={photo.name} />
				</div>)}
			</div>}
		</div>
	}
}));

const NewPost = () => <DynamicModuleLoader modules={[getPostModule()]}>
	<NewPostInternal />
</DynamicModuleLoader>;

export default NewPost;