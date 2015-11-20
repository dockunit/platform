'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import ProjectsStore from '../stores/ProjectsStore';
import If from './If';
import Help from './Help';
import ProjectListItem from './ProjectListItem';
import {connectToStores} from 'fluxible-addons-react';
import updateShowHelp from '../actions/updateShowHelp';

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

		console.log(this.props.ProjectsStore);

		return (
			<div>
				<Help>
					<div className="wrap">
						<div className="tab-content">
							<If test={projects instanceof Object && Object.keys(projects).length === 0}>
								<div className="first-project">
									<h1>Hey! Welcome to Dockunit.io.</h1>

									<p>You need to add some of your projects from Github to get started. <strong>Creating a Dockunit.io project is super easy</strong></p>

									<NavLink className="btn btn-primary btn-lg" routeName="addProject">Create My First Project</NavLink>
								</div>
							</If>

							<If test={projects instanceof Object && Object.keys(projects).length > 0}>
								<div>
									<h4>Projects</h4>

									<p>This screen shows all Dockunit.io projects. Remember, each Dockunit.io project is associated with a Github project. You can add as many Dockunit.io projects as you like.</p>
								</div>
							</If>
						</div>
					</div>
				</Help>

				<If test={projects instanceof Object && Object.keys(projects).length === 0}>
					<div className="no-projects">
						<h3>No projects to show right now.</h3>
					</div>
				</If>

				<If test={projects instanceof Object && Object.keys(projects).length > 0}>
					<div className="projects">
						{projects instanceof Object && Object.keys(projects).map(function(projectRepository) {
		                    return <ProjectListItem project={projects[projectRepository]} />     
		                })}
	                </div>
                </If>

                <If test={this.props.ProjectsStore.loadingMyProjects || null === projects}>
					<div className="loading-section">
						<span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
					</div>
				</If>
			</div>
		);
	}
}

export default ProjectList;
