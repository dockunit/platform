'use strict';
var React = require('react');
var UserStore = require('../stores/UserStore');
var ProjectsStore = require('../stores/ProjectsStore');
var ProjectList = require('./ProjectList.jsx');
var NavLink = require('flux-router-component').NavLink;

var Projects = React.createClass({
	statics: {
		storeListeners: {
			onUserStoreChange: [UserStore],
			onProjectsStoreChange: [ProjectsStore]
		}
	},

	getInitialState: function () {
		return {
			projects: []
		};
	},

	onProjectsStoreChange: function() {

	},

	onUserStoreChange: function() {

	},

	render: function() {
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
});

module.exports = Projects;
