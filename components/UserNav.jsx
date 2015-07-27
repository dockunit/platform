'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';
import If from './If';
import ImageLoader from 'react-imageloader';
import ApplicationStore from '../stores/ApplicationStore';
import UserStore from '../stores/UserStore';
import {connectToStores, provideContext} from 'fluxible-addons-react';

@provideContext
@connectToStores([ApplicationStore, UserStore], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState(),
    UserStore: context.getStore(UserStore).getState()
}))
class UserNav extends React.Component {
	static contextTypes = {
        getStore: React.PropTypes.func
    }

    constructor(props, context) {
        super(props, context);
    }

	static defaultProps = {
		selected: 'home',
		links: {}
    }

	getPasswordClasses() {
		var loginStatus = this.props.UserStore.loginHeaderStatus;

		if (1 === loginStatus) {
			return 'navbar-form navbar-right failed-login';
		} else {
			return 'navbar-form navbar-right';
		}
	}

	render() {
		let selected = this.props.selected;
		let links = this.props.links;

		let accountLinkHTML = Object.keys(links).map(function(name) {
			let className = '';
			let link = links[name];

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

		let gravatar = '';
		if (this.props.UserStore.currentUser && this.props.UserStore.currentUser.emailHash) {
			gravatar = 'http://www.gravatar.com/avatar/' + this.props.UserStore.currentUser.emailHash + '?s=36&d=404';
		}

		return (
			<div className="navbar-user">
				<If test={this.props.UserStore.currentUser}>
					<div className="navbar-profile">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<ImageLoader className="avatar" src={gravatar}>
								<div className="glyphicon glyphicon-user avatar no-avatar" aria-hidden="true"></div>
							</ImageLoader>
							
							<div className="username navbar-right">
								Hello <strong>{this.props.UserStore.currentUser ? this.props.UserStore.currentUser.username : ''}</strong> <span className="caret"></span>
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
				<If test={!this.props.UserStore.currentUser}>
					<form method="post" action="/login" className={this.props.UserStore.passwordClasses} noValidate>
						<div className="form-group">
							<input type="text" name="username" placeholder="Username" className="form-control"/>
						</div>
						<div className="form-group">
							<input type="password" name="password" className="form-control" placeholder="Password" />
						</div>
						<input
							type="hidden"
							name="_csrf"
							value={this.props.ApplicationStore.csrfToken}
						/>
						<input type="hidden" name="redirectPath" value={this.props.ApplicationStore.redirectPath} />
						<input type="hidden" name="type" value="header" />
						<button type="submit" className="btn btn-primary">Sign in</button>
					</form>
				</If>
			</div>
		);
	}
}

export default UserNav;
