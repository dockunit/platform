'use strict';

var createStore = require('fluxible/addons').createStore;
var _ = require('lodash');

var ProjectsStore = createStore({
	storeName: 'ProjectsStore',

	handlers: {
		'READ_MY_PROJECTS_SUCCESS': 'readMyProjectsSuccess',
		'READ_PROJECT_SUCCESS': 'readProjectSuccess',
		'CREATE_PROJECT_SUCCESS': 'createProjectSuccess',
		'UPDATE_PROJECT_BUILD': 'updateProjectBuild',
		'NEW_PROJECT_BUILD': 'newProjectBuild'
	},

	initialize: function () {
		this.projects = null;
	},

	updateProjectBuild: function(payload) {
		// Todo: this needs to be more efficient
		for (var i = 0; i < this.projects[payload.repository].builds.length; i++) {
			if (this.projects[payload.repository].builds[i]._id === payload.build._id) {
				this.projects[payload.repository].builds[i] = payload.build;
				this.emitChange();
				return;
			}
		}
	},

	newProjectBuild: function(payload) {
		this.projects[payload.repository].builds.unshift(payload.build);
		this.emitChange();
	},

	readMyProjectsSuccess: function(projects) {
		this.projects = projects;
		this.emitChange();
	},

	readProjectSuccess: function(project) {
		this.projects = this.projects || {};

		this.projects = _.extend(this.projects, project);

		this.emitChange();
	},

	createProjectSuccess: function(project) {
		if (!this.projects) {
			this.projects = {};
		}

		this.projects[project.repository] = project;
		this.emitChange();
	},

	getState: function() {
		return {
			projects: this.projects
		};
	},

	getProjects: function() {
		return this.projects;
	},

	dehydrate: function() {
		return this.getState();
	},

	rehydrate: function(state) {
		this.projects = state.projects;
	}
});

module.exports = ProjectsStore;