'use strict';
var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var UserNav = require('./UserNav');
var If = require('./If');

var Nav = React.createClass({
	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            selected: 'home',
            links: {}
        };
    },

    render: function() {
        var selected = this.props.selected;
        var links = this.props.links;

        var exploreLinkHTML = Object.keys(links).map(function(name) {
            var className = '';
            var link = links[name];

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
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<NavLink className="navbar-brand" routeName="home">
							<img src="/public/img/logo.png" />
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
							<UserNav selected={this.props.selected} links={this.props.links}  />
						</If>
					</div>
				</div>
			</nav>
        );
    }
});

module.exports = Nav;
