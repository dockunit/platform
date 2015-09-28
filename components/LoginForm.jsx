'use strict';

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import UserStore from '../stores/UserStore';
import If from './If';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['ApplicationStore', 'UserStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState(),
    UserStore: context.getStore(UserStore).getState()
}))
class LoginForm extends React.Component {
	constructor(props, context) {
        super(props, context);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    }

	render() {
		return (
			<form method="post" action="/login" noValidate>
				<If test={(1 === this.props.UserStore.loginFormStatus)}>
					<div className="alert alert-danger" role="alert">
						<span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
						<span className="sr-only">Error:</span>
						This user does not exist or your password is incorrect.
					</div>
				</If>

				<div className="form-group">
					<input type="text" name="username" placeholder="Username" className="form-control" />
				</div>
				<div className="form-group">
					<input type="password" name="password" placeholder="Password" className="form-control" />
				</div>
				<input type="hidden" name="_csrf" value={this.props.ApplicationStore.csrfToken} />
				<input type="hidden" name="redirectPath" value={this.props.redirectPath} />
				<input type="hidden" name="type" value="form" />

				<button type="submit" className="btn btn-primary btn-lg">Sign in</button>
			</form>
		);
	}
}

export default LoginForm;
