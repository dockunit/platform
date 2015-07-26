'use strict';
var React = require('react');
var ProjectsStore = require('../stores/ProjectsStore');
var ProjectListItem = require('./ProjectListItem');
var If = require('./If');
var NavLink = require('flux-router-component').NavLink;

var Projects = React.createClass({
	contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },

	statics: {
		storeListeners: {
			onProjectsStoreChange: [ProjectsStore]
		}
	},

	getInitialState: function () {
		return {
			projects: this.context.getStore(ProjectsStore).getMyProjects()
		};
	},

	onProjectsStoreChange: function() {
		this.setState({
			projects: this.context.getStore(ProjectsStore).getMyProjects()
		});
	},

	render: function() {
		var self = this;

		return (
			<div>
				<If test={this.state.projects instanceof Object && Object.keys(this.state.projects).length === 0}>
					<div className="no-projects">
						<h3>No projects to show right now. <NavLink routeName="addProject">Add one?</NavLink></h3>
					</div>
				</If>

				<If test={null === this.state.projects}>
					<div className="loading-section">
						<h3>Hey there, we are looking up your projects. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
					</div>
				</If>

				<If test={this.state.projects instanceof Object && Object.keys(this.state.projects).length > 0}>
					<div className="projects">
						{this.state.projects instanceof Object && Object.keys(this.state.projects).map(function(projectRepository) {
		                    return <ProjectListItem project={self.state.projects[projectRepository]} />     
		                })}
	                </div>
                </If>
			</div>
		);
	}
});

module.exports = Projects;
