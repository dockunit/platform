'use strict';
var React = require('react');
var UserStore = require('../stores/UserStore');
var NavLink = require('flux-router-component').NavLink;

var Home = React.createClass({
	statics: {
		storeListeners: {
			onUserStoreChange: [UserStore]
		}
	},

	onUserStoreChange: function() {
		this.setState(this.getState());
	},

    getInitialState: function () {
        return {};
    },
    
    render: function() {
        return (
			<div>
				<div className="jumbotron">
					<div className="container">
						<h1>Welcome to Dockunit.io</h1>
						<p>Dockunit.io is a continuous integration service for running Dockunit test suites hosted on <strong>Github</strong>. The days of staggering launches are long gone. Automatically test the integrity of each change to your software as a part of your workflow. Quickly and effectively respond to issues with insightful reports on software issues.</p>
						<p>
							<NavLink className="btn btn-primary btn-lg" role="button" routeName="register">Sign up »</NavLink>
						</p>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-md-4">
							<h2>No Environment Restrictions</h2>
							<p>Dockunit.io runs <a href="http://github.com/tlovett1/dockunit">Dockunit</a> tests which run test suites in Docker containers that you define. Docker containers allow you to build an environment from scratch. There are many <a href="https://registry.hub.docker.com/">prebuilt Docker containers</a> available for you to get started.</p>
						</div>
						<div className="col-md-4">
							<h2>No Limitions</h2>
							<p>Integrate as many Github repositories as you need. Run as many builds as you like. Dockunit.io provides the application testing flexibility that your software projects require.</p>
						</div>
						<div className="col-md-4">
							<h2>Public and Private Repos</h2>
							<p>Integrate with both your public and private repos on Github. No need to sign up for a premium account to access your private repositories.</p>
						</div>
					</div>
				</div>
			</div>
        );
    }
});

module.exports = Home;
