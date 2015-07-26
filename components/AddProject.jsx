'use strict';
var React = require('react');
var AddProjectForm = require('./AddProjectForm.jsx');
var createProject = require('../actions/createProject');
var navigate = require('flux-router-component').navigateAction;

var AddProject = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },

	add: function(project, done) {
		this.context.executeAction(createProject, project);
	},

	render: function() {
		return <AddProjectForm onAdd={this.add} />
	}
});

module.exports = AddProject;
