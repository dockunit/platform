'use strict';

import React from 'react';
import {NavLink} from 'fluxible-router';

class Home extends React.Component {

    render() {
        return (
			<div>
				<div className="jumbotron home">
					<div className="container">
						<div className="text-wrapper">
							<h1>Welcome to Dockunit.io</h1>
							<p>Dockunit.io is a <strong>containerized</strong> continuous integration testing service for running Dockunit test suites hosted on <strong>Github</strong>.</p>
							<div className="button-wrapper">
								<NavLink className="btn btn-primary btn-lg" role="button" routeName="register">Sign up »</NavLink>
							</div>
						</div>
					</div>
				</div>
				<div className="steps-wrapper home-panel">
					<div className="container steps">
						<h1>How Does It Work?</h1>
						<div className="home-panel-heading-divider"></div>
						<p className="home-panel-subheading">Dockunit.io is super easy to use. Set it up once and it just works.</p>

						<div className="row">
							<div className="col-md-4">
								<div className="glyphicon glyphicon-download-alt"></div>
								<h2>Setup npm Command</h2>
								<p>Setup <a href="https://www.npmjs.com/package/dockunit">Dockunit</a> on your machine, using NPM installation is quick and easy.</p>
							</div>
							<div className="col-md-4">
								<div className="glyphicon glyphicon-th-list"></div>
								<h2>Choose Your Test Images</h2>
								<p>Configure a <a href="https://github.com/dockunit/dockunit#dockunitjson-examples">Dockunit.json</a> file to your Github repository.</p>
							</div>
							<div className="col-md-4">
								<div className="glyphicon glyphicon-cog"></div>
								<h2>Connect to Dockunit.io</h2>
								<p><NavLink routeName="addProject">Create a project</NavLink> for your Github repository and watch the integrity tests of your build.</p>
							</div>
						</div>
					</div>
				</div>
				<div className="get-started-wrapper">
					<div className="container get-started">
						<div className="row">
							<h1>Ready to Get Started?</h1>
							<NavLink className="btn btn-lg btn-success" role="button" routeName="register">Sign Up</NavLink>
						</div>
					</div>
				</div>
				<div className="container attributes-panel">
					<div className="row">

						<div className="col-md-4">
							<h2>No Environment Restrictions</h2>
							<div className="home-panel-heading-divider"></div>
							<p>Dockunit.io runs <a href="https://www.npmjs.com/package/dockunit">Dockunit</a> tests which run test suites in Docker containers that you define. Docker containers allow you to build an environment from scratch. There are many <a href="https://hub.docker.com/r/dockunit/prebuilt-images/">prebuilt Docker containers</a> available for you to get started.</p>
						</div>
						<div className="col-md-4">
							<h2>No Limitions</h2>
							<div className="home-panel-heading-divider"></div>
							<p>Integrate as many Github repositories as you need. Run as many builds as you like. Dockunit.io provides the application testing flexibility that your software projects require.</p>
						</div>
						<div className="col-md-4">
							<h2>Public and Private Repos</h2>
							<div className="home-panel-heading-divider"></div>
							<p>Integrate with both your public and private repos on Github. No need to sign up for a premium account to access your private repositories.</p>
						</div>
					</div>
				</div>
			</div>
        );
    }
}

export default Home;
