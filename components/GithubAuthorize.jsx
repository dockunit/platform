'use strict';

import React from 'react';
import UserStore from '../stores/UserStore';
import constants from '../constants';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['UserStore'], (context, props) => ({
    UserStore: context.getStore(UserStore).getState()
}))
class GithubAuthorize extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    }

	handleClick(event) {
		event.preventDefault();

		let state = this.props.UserStore.currentUser.githubStateToken;
		let redirect = 'https://dockunit.io/projects/authorize';
		let clientId = constants.githubClientId;

		let url = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&amp;scope=admin:repo_hook,admin:org_hook,repo:status,repo&amp;state=' + state + '&amp;redirect_uri=' + redirect;

		window.document.cookie = 'state=' + state;
		window.document.location = url;
	}

	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1>Authorize Github Account</h1>
				</div>

				<p>We need read access to your Github account so we can get a list of your repositories.</p>

				<a type="submit" className="btn btn-lg btn-primary" onClick={this.handleClick}>
					<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
					Connect Github Account
				</a>
			</div>
		);
	}
}

export default GithubAuthorize;
