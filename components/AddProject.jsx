'use strict';
var React = require('react');
var AddProjectForm = require('./AddProjectForm.jsx');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var createProject = require('../actions/createProject');
var navigate = require('flux-router-component').navigateAction;

var AddProject = React.createClass({
	mixins: [FluxibleMixin],

	add: function(project, done) {
		this.executeAction(createProject, project);
	},

	render: function() {
		return <AddProjectForm onAdd={this.add} />
	}
});

module.exports = AddProject;
