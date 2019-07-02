import * as React from 'react';
import { withRouter } from 'react-router';

const Album = withRouter(props => <h1>Album {props.match.params && props.match.params.id }</h1>);

export default Album;