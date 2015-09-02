'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import ProjectsStore from '../stores/ProjectsStore';
import If from './If';
import ProjectListItem from './ProjectListItem';
import {connectToStores} from 'fluxible-addons-react';


@connectToStores(['ProjectsStore'], (context, props) => ({
    ProjectsStore: context.getStore(ProjectsStore).getState()
}))
class ProjectList extends React.Component {
	constructor(props, context) {
        super(props, context);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    }

	render() {
		let projects = ProjectsStore.filterMyProjects(this.props.ProjectsStore.projects);

		return (
			<div>
				<If test={projects instanceof Object && Object.keys(projects).length === 0}>
					<div className="no-projects">
						<h3>No projects to show right now. <NavLink routeName="addProject">Add one?</NavLink></h3>
					</div>
				</If>

				<If test={null === projects}>
					<div className="loading-section">
						<h3>Hey there, we are looking up your projects. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
					</div>
				</If>

				<If test={projects instanceof Object && Object.keys(projects).length > 0}>
					<div className="projects">
						{projects instanceof Object && Object.keys(projects).map(function(projectRepository) {
		                    return <ProjectListItem project={projects[projectRepository]} />     
		                })}
	                </div>
                </If>
			</div>
		);
	}
}

export default ProjectList;
