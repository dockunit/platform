'use strict';

import React from 'react';
import {NavLink} from 'fluxible-router';

class Home extends React.Component {
    
    render() {
        return (
			<div>
				<div className="jumbotron">
					<div className="container">
						<div className="text-wrapper">
							<h1>Welcome to Dockunit.io</h1>
							<p>Dockunit.io is a <strong>containerized</strong> continuous integration service for running Dockunit test suites hosted on <strong>Github</strong>.</p>
							<div className="button-wrapper">
								<NavLink className="btn btn-primary btn-lg" role="button" routeName="register">Sign up »</NavLink>
							</div>
						</div>
					</div>
				</div>
				<div className="container steps">
					<div className="row">
						<div className="col-md-4">
							<h2>Step 1</h2>
							<p>Install <a href="https://www.npmjs.com/package/dockunit">Dockunit</a> on your machine. npm makes installation super quick and easy.</p>
						</div>
						<div className="col-md-4">
							<h2>Step 2</h2>
							<p>Add a <a href="https://github.com/tlovett1/dockunit#dockunitjson-examples">Dockunit.json</a> file to your Github repository.</p>
						</div>
						<div className="col-md-4">
							<h2>Step 3</h2>
							<p><NavLink routeName="addProject">Create a project</NavLink> for your Github repository. The project dashboard will continuously test the integrity of your build.</p>
						</div>
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
}

export default Home;
