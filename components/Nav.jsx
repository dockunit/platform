'use strict';

import React from 'react';
import {NavLink} from 'fluxible-router';
import UserNav from './UserNav';
import If from './If';
import routes from '../configs/routes';
import {provideContext} from 'fluxible-addons-react';

class Nav extends React.Component {
	static defaultProps = {
		selected: 'home',
		links: {}
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
                    <NavLink routeName={link.page}>{link.title}</NavLink>
                </li>
            );
        });

        return (
			<nav className="navbar navbar-inverse navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed toggle-main-nav" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<NavLink className="navbar-brand" routeName="home">
							<img src="/public/img/logo.png" width="200" height="39" />
						</NavLink>
					</div>
					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li className="dropdown active">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Explore <span className="caret"></span></a>
								<ul className="dropdown-menu" role="menu">
								{exploreLinkHTML}
								</ul>
							</li>
						</ul>

						<If test={('login' !== this.props.selected)}>
							<UserNav redirectPath={redirectPath} selected={this.props.selected} links={this.props.links}  />
						</If>
					</div>
				</div>
			</nav>
        );
    }
}

export default Nav;
