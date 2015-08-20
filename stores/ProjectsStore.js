'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';
import _ from 'lodash';

class ProjectsStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);

		this.projects = null;
		this.projectsNotFound = {};
	}

	updateProjectBuild(payload) {
		// Todo: this needs to be more efficient
		for (var i = 0; i < this.projects[payload.repository].builds.length; i++) {
			if (this.projects[payload.repository].builds[i]._id === payload.build._id) {
				this.projects[payload.repository].builds[i] = payload.build;
				this.emitChange();
				return;
			}
		}
	}

	newProjectBuild(payload) {
		this.projects[payload.repository].builds.push(payload.build);
		this.emitChange();
	}

	rerunProjectBuild(payload) {
		this.projects[payload.repository].builds = payload.project.builds;
		this.emitChange();
	}

	readMyProjectsSuccess(projects) {
		this.projects = projects;
		this.emitChange();
	}

	readProjectSuccess(project) {
		this.projects = this.projects || {};

		this.projects = _.extend(this.projects, project);

		this.emitChange();
	}

	updateProjectSuccess(project) {
		this.projects = this.projects || {};

		let projects = {};
		projects[project.repository] = project;

		this.projects = _.extend(this.projects, projects);

		this.emitChange();
	}

	readProjectFailure(params) {
		this.projectsNotFound[params.repository] = true;

		this.emitChange();
	}

	createProjectSuccess(project) {
		if (!this.projects) {
			this.projects = {};
		}

		this.projects[project.repository] = project;
		this.emitChange();
	}

	deleteProjectSuccess(repository) {
		if (this.projects[repository]) {
			delete this.projects[repository];
		}

		this.emitChange();
	}

	getState() {
		return {
			projects: this.projects,
			projectsNotFound: this.projectsNotFound
		};
	}

	static filterMyProjects(projects) {
		let myProjects = {};

		for (let repo in projects) {
			if (projects[repo].mine) {
				myProjects[repo] = projects[repo];
			}
		}

		return myProjects;
	}

	static isMyProject(project, currentUser) {
		if (!project || !project.user || !currentUser || !currentUser._id) {
			return false;
		}

		return (project.user === currentUser._id);
	}

	dehydrate() {
		return this.getState();
	}

	rehydrate(state) {
		this.projects = state.projects;
		this.projectsNotFound = state.projectsNotFound;
	}
}

ProjectsStore.handlers = {
	'READ_MY_PROJECTS_SUCCESS': 'readMyProjectsSuccess',
	'READ_PROJECT_SUCCESS': 'readProjectSuccess',
	'READ_PROJECT_FAILURE': 'readProjectFailure',
	'CREATE_PROJECT_SUCCESS': 'createProjectSuccess',
	'DELETE_PROJECT_SUCCESS': 'deleteProjectSuccess',
	'UPDATE_PROJECT_SUCCESS': 'updateProjectSuccess',
	'UPDATE_PROJECT_BUILD': 'updateProjectBuild',
	'NEW_PROJECT_BUILD': 'newProjectBuild',
	'RERUN_PROJECT_BUILD': 'rerunProjectBuild'
};

ProjectsStore.storeName = 'ProjectsStore';

export default ProjectsStore;