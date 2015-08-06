'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import ProjectList from './ProjectList';

class Projects extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="projects-nav">
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
