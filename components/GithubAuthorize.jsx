'use strict';
var React = require('react');
var UserStore = require('../stores/UserStore');

var GithubAuthorize = React.createClass({
	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },

	handleClick: function(event) {
		event.preventDefault();

		var state = this.context.getStore(UserStore).getCurrentUser().githubStateToken;
		var redirect = 'http://dockunit.io/projects/authorize';
		var clientId = require('../constants').githubClientId;

		var url = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&amp;scope=admin:repo_hook,admin:org_hook,repo:status,repo&amp;state=' + state + '&amp;redirect_uri=' + redirect;

		window.document.cookie = 'state=' + state;
		window.document.location = url;
	},

	render: function() {
		return (
			<div className="container">
				<div className="page-header">
					<h1>Authorize Github Account</h1>
				</div>

				<p>We need read access to your Github account so we can get a list of your repositories.</p>

				<a
					type="submit"
					className="btn btn-lg btn-primary"
					onClick={this.handleClick}
				>
					<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
					Connect Github Account
				</a>
			</div>
			);
	}
});

module.exports = GithubAuthorize;
