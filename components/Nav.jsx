'use strict';

import React from 'react';
import {NavLink} from 'fluxible-router';
import ApplicationStore from '../stores/ApplicationStore';
import UserStore from '../stores/UserStore';
import If from './If';
import routes from '../configs/routes';
import {provideContext, connectToStores} from 'fluxible-addons-react';
import ImageLoader from 'react-imageloader';

@connectToStores(['ApplicationStore', 'UserStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState(),
    UserStore: context.getStore(UserStore).getState()
}))
class Nav extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.getPasswordClasses = this.getPasswordClasses.bind(this);
    }

	static defaultProps = {
		selected: 'home',
		links: {}
    }

    getPasswordClasses() {
		let loginStatus = this.props.UserStore.loginHeaderStatus;

		if (1 === loginStatus) {
			return 'navbar-form failed-login';
		} else {
			return 'navbar-form';
		}
	}

    render() {
    	let redirectPath = (this.props.redirectPath) ? this.props.redirectPath : '/';
        let selected = this.props.selected;

        let exploreLinkHTML = Object.keys(routes).map(function(name) {
            let className = '';
            let link = routes[name];

			if (!link.type || 'explore' !== link.type) {
				return false;
			}

            if (selected === name) {
                className = 'active';
            }

            return (
                <li className={className} key={link.path}>
                    <NavLink data-toggle="collapse" data-target=".navbar-collapse" routeName={link.page}>{link.title}</NavLink>
                </li>
            );
        });

        let accountLinkHTML = Object.keys(routes).map(function(name) {
			let className = '';
			let link = routes[name];

			if (!link.type || 'account' !== link.type) {
				return false;
			}

			if (selected === name) {
				className = 'active';
			}

			return (
				<li className={className} key={link.path}>
					<NavLink data-toggle="collapse" data-target=".navbar-collapse" routeName={link.page}>{link.title}</NavLink>
				</li>
			);
		});

        let gravatar = '';
		if (this.props.UserStore.currentUser && this.props.UserStore.currentUser.emailHash) {
			gravatar = 'https://www.gravatar.com/avatar/' + this.props.UserStore.currentUser.emailHash + '?s=36&d=404';
		}

        return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<NavLink data-toggle="collapse" data-target=".navbar-collapse" className="navbar-brand" routeName="home"><img src="/public/img/logo.png" width="200" height="39" /></NavLink>
					</div>
					<div id="navbar" className="navbar-collapse collapse" aria-expanded="false">
						<ul className="nav navbar-nav">
							<li className="dropdown">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Explore <span className="caret"></span></a>
								<ul className="dropdown-menu">
									<If test={!this.props.UserStore.currentUser}>
										<li><NavLink data-toggle="collapse" data-target=".navbar-collapse" routeName="login">Log in</NavLink></li>
									</If>
									{exploreLinkHTML}
								</ul>
							</li>
						</ul>

						<div className="navbar-right">
							<If test={this.props.UserStore.currentUser}>
								<ul className="nav navbar-nav">
									<li className="dropdown">
										<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
											Hello <strong>{this.props.UserStore.currentUser ? this.props.UserStore.currentUser.username : ''}</strong> <span className="caret"></span>
											<ImageLoader className="avatar" src={gravatar}>
												<div className="glyphicon glyphicon-user avatar no-avatar" aria-hidden="true"></div>
											</ImageLoader>
										</a>
										<ul className="dropdown-menu">
											{accountLinkHTML}
											<li><a href="/logout">Logout</a></li>
										</ul>
									</li>
								</ul>
							</If>

							<If test={!this.props.UserStore.currentUser}>
								<form method="post" action="/login" className={this.getPasswordClasses()} noValidate>
									<div className="form-group">
										<input type="text" name="username" placeholder="Username" className="form-control"/>
									</div>
									<div className="form-group">
										<input type="password" name="password" className="form-control" placeholder="Password" />
									</div>
									<input type="hidden" name="_csrf" value={this.props.ApplicationStore.csrfToken} />
									<input type="hidden" name="redirectPath" value={redirectPath} />
									<input type="hidden" name="type" value="header" />
									<button type="submit" className="btn btn-primary">Sign in</button>
								</form>
							</If>
						</div>
					</div>
				</div>
			</nav>
        );
    }
}

export default Nav;
