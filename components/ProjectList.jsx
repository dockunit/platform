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

    componentDidMount() {
    	jQuery(React.findDOMNode(this.refs.addProject)).popover({
			placement: 'bottom',
			html: true,
			content: 'hello'
		}).popover('show');
    }

	render() {
		let projects = ProjectsStore.filterMyProjects(this.props.ProjectsStore.projects);

		return (
			<div>
				<If test={projects instanceof Object && Object.keys(projects).length === 0}>
					<div className="no-projects">
						<div className="help">
							<button type="button" className="close" data-dismiss=".help" aria-label="Close"><span aria-hidden="true">×</span></button>
							<h4>Welcome to Dockunit.io</h4>

							<p>Hey! Welcome to Dockunit.io. You need to add some of your projects from Github to get started. <span className="help-pointer" data-help-highlight=".addProjectLink">1</span></p>

						</div>
						
						<h3>No projects to show right now. <NavLink className="addProjectLink" routeName="addProject">Add one?</NavLink></h3>
					</div>
				</If>

				<If test={null === projects}>
					<div className="loading-section">
						<span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
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
