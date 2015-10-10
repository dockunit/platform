'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import ProjectList from './ProjectList';
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
						<button className="btn btn-success btn-sm" type="button" data-toggle="collapse" data-target=".help" aria-expanded="false">
							Help
						</button>
					</div>

					<NavLink routeName="addProject">
						<button type="button" className="btn btn-sm btn-primary">
							<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
							Add a project
						</button>
					</NavLink>
				</div>

				<ProjectList />
			</div>
		);
	}
}

export default Projects;
