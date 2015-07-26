'use strict';
var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var UserStore = require('../stores/UserStore');
var ApplicationStore = require('../stores/ApplicationStore');
var If = require('./If');
var ImageLoader = require('react-imageloader');

var UserNav = React.createClass({
	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },

	statics: {
		storeListeners: {
			onUserStoreChange: [UserStore],
			onApplicationStoreChange: [ApplicationStore]
		}
	},

	getDefaultProps: function () {
		return {
			selected: null,
			links: {}
		};
	},

	getInitialState: function() {
		return {
			currentUser: this.context.getStore(UserStore).getCurrentUser(),
			csrf: this.context.getStore(ApplicationStore).getCsrfToken(),
			redirectPath: this.context.getStore(ApplicationStore).getCurrentRoute().config.path,
			passwordClasses: this.getPasswordClasses(),
			loginStatus: this.context.getStore(UserStore).getLoginHeaderStatus()
		};
	},

	getPasswordClasses: function() {
		var loginStatus = this.context.getStore(UserStore).getLoginHeaderStatus();

		if (1 === loginStatus) {
			return 'navbar-form navbar-right failed-login';
		} else {
			return 'navbar-form navbar-right';
		}
	},

	onUserStoreChange: function () {
		var newState = {};
		newState.currentUser = this.context.getStore(UserStore).getCurrentUser();
		newState.passwordClasses = this.getPasswordClasses();

		this.setState(newState);
	},

	onApplicationStoreChange: function () {
		var newState = {
			csrf: this.context.getStore(ApplicationStore).getCsrfToken(),
			redirectPath: this.context.getStore(ApplicationStore).getCurrentRoute().config.path
		};

		this.setState(newState);
	},

	render: function() {
		var selected = this.props.selected;
		var links = this.props.links;

		var accountLinkHTML = Object.keys(links).map(function(name) {
			var className = '';
			var link = links[name];

			if (!link.type || 'account' !== link.type) {
				return false;
			}

			if (selected === name) {
				className = 'active';
			}

			return (
				<li className={className} key={link.path}>
					<NavLink routeName={link.page}>{link.title}</NavLink>
				</li>
				);
		});

		var gravatar = '';
		if (this.state.currentUser && this.state.currentUser.emailHash) {
			gravatar = 'http://www.gravatar.com/avatar/' + this.state.currentUser.emailHash + '?s=36&d=404';
		}

		return (
			<div className="navbar-user">
				<If test={this.state.currentUser}>
					<div className="navbar-profile">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<ImageLoader className="avatar" src={gravatar}>
								<div className="glyphicon glyphicon-user avatar no-avatar" aria-hidden="true"></div>
							</ImageLoader>
							
							<div className="username navbar-right">
								Hello <strong>{this.state.currentUser ? this.state.currentUser.username : ''}</strong> <span className="caret"></span>
							</div>
						</a>
						<ul className="dropdown-menu" role="menu">
							{accountLinkHTML}
							<li>
								<a href="/logout">Logout</a>
							</li>
						</ul>
					</div>
				</If>
				<If test={!this.state.currentUser}>
					<form method="post" action="/login" className={this.state.passwordClasses} noValidate>
						<div className="form-group">
							<input type="text" name="username" placeholder="Username" className="form-control"/>
						</div>
						<div className="form-group">
							<input type="password" name="password" className="form-control" placeholder="Password" />
						</div>
						<input
							type="hidden"
							name="_csrf"
							value={this.state.csrf}
						/>
						<input type="hidden" name="redirectPath" value={this.state.redirectPath} />
						<input type="hidden" name="type" value="header" />
						<button type="submit" className="btn btn-primary">Sign in</button>
					</form>
				</If>
			</div>
			);
	}
});

module.exports = UserNav;
