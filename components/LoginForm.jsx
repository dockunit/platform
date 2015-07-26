'use strict';

var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var UserStore = require('../stores/UserStore');
var If = require('./If');

var LoginForm = React.createClass({
	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },

	statics: {
		storeListeners: {
			onUserStoreChange: [UserStore],
			onApplicationStoreChange: [ApplicationStore]
		}
	},

	getInitialState: function() {
		return {
			csrf: this.context.getStore(ApplicationStore).getCsrfToken(),
			redirectPath: this.context.getStore(ApplicationStore).getRedirectPath(),
			loginStatus: this.context.getStore(UserStore).getLoginFormStatus()
		};
	},

	onUserStoreChange: function() {
		var newState = {
			loginStatus: this.context.getStore(UserStore).getLoginStatus()
		};

		this.setState(newState);
	},

	onApplicationStoreChange: function() {
		var newState = {
			csrf: this.context.getStore(ApplicationStore).getCsrfToken(),
			redirectPath: this.context.getStore(ApplicationStore).getRedirectPath()
		};

		this.setState(newState);
	},

	render: function () {
		return (
			<form method="post" action="/login" noValidate>
				<If test={(1 === this.state.loginStatus)}>
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
				<input type="hidden" name="_csrf" value={this.state.csrf} />
				<input type="hidden" name="redirectPath" value={this.state.redirectPath} />
				<input type="hidden" name="type" value="form" />

				<button type="submit" className="btn btn-primary btn-lg">Sign in</button>
			</form>
		);
	}
});

module.exports = LoginForm;
