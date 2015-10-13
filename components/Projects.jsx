'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import ProjectList from './ProjectList';
import Help from './Help';
import HelpButton from './HelpButton';
import UserStore from '../stores/UserStore';
import readMyProjects from '../actions/readMyProjects';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['UserStore'], (context, props) => ({
    UserStore: context.getStore(UserStore).getState()
}))
class Projects extends React.Component {
	static contextTypes = {
        executeAction: React.PropTypes.func
    }

	componentWillMount() {
        if (this.props.UserStore.currentUser) {
            this.context.executeAction(readMyProjects, { mine: true });
        }
    }

	render() {
		return (
			<div className="container">
				<div className="projects-nav">
					<div className="right">
						<HelpButton />
					</div>

					<NavLink routeName="addProject">
						<button type="button" className="btn btn-sm btn-primary">
							<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
							Add a project
						</button>
					</NavLink>
				</div>

				<Help>
					<div className="tab-content">
						<h4>Welcome to Dockunit.io</h4>

						<p>Hey! Welcome to Dockunit.io. You need to add some of your projects from Github to get started.</p>
					</div>
				</Help>

				<ProjectList />
			</div>
		);
	}
}

export default Projects;
