/*global window */

'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import If from './If';
import ProjectsStore from '../stores/ProjectsStore';
import UserStore from '../stores/UserStore';
import readProject from '../actions/readProject';
import BuildList from './BuildList';
import {connectToStores} from 'fluxible-addons-react';
import updateProject from '../actions/updateProject';
import rerunBuild from '../actions/rerunBuild';
import deleteProject from '../actions/deleteProject';
import createBuild from '../actions/createBuild';
import readGithubRepoBranches from '../actions/readGithubRepoBranches';
import SelectField from './SelectField';
import _ from 'lodash';

@connectToStores(['UserStore', 'ProjectsStore'], (context, props) => ({
    UserStore: context.getStore(UserStore).getState(),
    ProjectsStore: context.getStore(ProjectsStore).getState()
}))
class Project extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.changeBranch = this.changeBranch.bind(this);
        this.toggleEditingPrimaryBranch = this.toggleEditingPrimaryBranch.bind(this);
        this.changePrimaryBranch = this.changePrimaryBranch.bind(this);
        this.changePrimaryBranchField = this.changePrimaryBranchField.bind(this);
        this.onHashChange = this.onHashChange.bind(this);
        this.rerun = this.rerun.bind(this);
        this.createBuild = this.createBuild.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func
    }

	state = {
		project: null,
		currentBranch: null,
		editingPrimaryBranch: false,
		primaryBranchField: '',
	}

	rerun(buildId) {
		this.context.executeAction(rerunBuild, {
			project: _.omit( this.state.project, 'builds' ),
			buildId: buildId
		});

		swal({
			title: 'Nice!',
			text: 'Your build has been queued.',
			type: 'success',
			timer: 2000,
			showConfirmButton: false
		});
	}

	deleteProject() {
		let self = this;

		swal({
			title: 'Are you sure?',
			text: 'You will not be able to recover a deleted project.',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			closeOnConfirm: true
		}, function() {
			self.context.executeAction(deleteProject, {
				project: self.state.project
			});
		});
	}

	createBuild(event) {
		event.preventDefault();

		this.context.executeAction(createBuild, {
			project: _.omit( this.state.project, 'builds' ),
			branch: this.state.currentBranch
		});

		swal({
			title: 'Nice!',
			text: 'Your build has been queued.',
			type: 'success',
			timer: 2000,
			showConfirmButton: false
		});
	}

	toggleEditingPrimaryBranch() {
		this.context.executeAction(readGithubRepoBranches, {
			repository: this.props.repository,
			token: this.props.UserStore.currentUser.githubAccessToken
		});

		this.setState({editingPrimaryBranch: !this.state.editingPrimaryBranch});
	}

	changePrimaryBranchField(event) {
		this.setState({primaryBranchField: event.target.value});
	}

	changePrimaryBranch() {
		this.context.executeAction(updateProject, {
			branch: this.state.primaryBranchField,
			project: this.state.project
		});

		this.setState({editingPrimaryBranch: false});
	}

	componentDidMount() {
		let self = this;

		jQuery(React.findDOMNode(self.refs.buildImage)).popover({
			trigger: 'click',
			placement: 'bottom',
			html: true,
			content: function() {
				let currentBranch = self.state.currentBranch || '';

				let textarea = document.createElement('textarea');
				textarea.className = 'form-control';
				textarea.value = '[![Dockunit Status](https://dockunit.io/svg/' + self.props.repository + '?' + currentBranch + ')](https://dockunit.io/projects/' + self.props.repository + '#' + currentBranch + ')';

				return textarea;
			}
		});

		let hash = window.location.hash.replace(/^#(.*)$/i, '$1');
		if (hash) {
			this.setState({currentBranch: hash});
		}

		// No early IE
		if (window.addEventListener) {
			window.addEventListener('hashchange', this.onHashChange, false);
		}
	}

	componentWillUnmount() {
		// No early IE
		if (window.removeEventListener) {
			window.removeEventListener('hashchange', this.onHashChange, false);
		}
	}

	onHashChange() {
		let hash = window.location.hash.replace(/^#(.*)$/i, '$1');
		if (hash) {
			this.setState({currentBranch: hash});
		}
	}

	componentWillReceiveProps(props) {
		let projects = props.ProjectsStore.projects;

		if (projects && projects[props.repository]) {
			let state = {};
			state.project = projects[props.repository];

			if (!window.location.hash.replace(/^#(.*)$/i, '$1')) {
				state.currentBranch = state.project.branch;
			}

			if (!this.state.currentBranch) {
				state.currentBranch = projects[props.repository].branch;
			}

			state.primaryBranchField = state.project.branch;

			this.setState(state);
		} else if (props.ProjectsStore.projectsNotFound && props.ProjectsStore.projectsNotFound[props.repository]) {
			this.setState({ project: false });
		}
	}

	componentWillMount() {
 		this.context.executeAction(readProject, { repository: this.props.repository });
    }

	changeBranch(event) {
		event.preventDefault();

		window.location.hash = event.target.innerText || event.target.textContent;
	}

    render() {
    	let nonCurrentBranches = [],
    		builds = [];

    	if (this.state.project) {
    		nonCurrentBranches = {};

    		this.state.project.builds.forEach(function(build) {
    			if (build.branch !== this.state.currentBranch) {
    				nonCurrentBranches[build.branch] = true;
    			} else {
    				builds.unshift(build);
    			}
    		}, this);

    		if (this.state.currentBranch !== this.state.project.branch) {
    			nonCurrentBranches[this.state.project.branch] = true;
    		}

    		nonCurrentBranches = Object.keys(nonCurrentBranches);
    	}

    	let branchButtonClasses = 'btn btn-sm dropdown-toggle';
    	if (!nonCurrentBranches.length) {
    		branchButtonClasses += ' one-branch';
    	}

    	let svgUrl = '/svg/' + this.props.repository
    	if (this.state.currentBranch) {
    		svgUrl += '?' + this.state.currentBranch;
    		svgUrl += '&' + new Date().getTime();
    	} else {
    		svgUrl += '?date=' + new Date().getTime();
    	}

    	let primaryBranch = '';
    	if (this.state.project) {
    		primaryBranch = this.state.project.branch;
    	}

    	let editBranches = [];
    	if (this.props.UserStore.currentUser && this.props.UserStore.currentUser.repositories && this.props.UserStore.currentUser.repositories[this.props.repository]) {
    		editBranches = Object.keys(this.props.UserStore.currentUser.repositories[this.props.repository].branches);
    	}

    	return (
            <div className="container">
            	<h1 className="page-header project-header">
					<If test={this.props.UserStore.currentUser}>
						<NavLink routeName="projects" className="breadcrumb-link">projects</NavLink> 
					</If>

					<span className="project-title">{this.props.repository}</span> <img ref="buildImage" title="Build Image Markdown" className="build-image" src={svgUrl} />
					
					<If test={this.props.UserStore.currentUser && ProjectsStore.isMyProject(this.state.project, this.props.UserStore.currentUser)}>
						<span onClick={this.deleteProject} className="delete-project">Delete <span className="glyphicon glyphicon-remove" aria-hidden="true"></span></span>
					</If>
				</h1>

				<If test={false === this.state.project}>
					<div className="no-projects">
						<h3>We couldn't find this project. Maybe you don't have access?</h3>
					</div>
				</If>

				<If test={null === this.state.project}>
					<div className="loading-section">
						<span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
					</div>
				</If>

				<If test={this.state.project && !builds.length && !Object.keys(nonCurrentBranches).length}>
					<div className="no-builds">
						<h3>This project currently has no builds. Try <a href="" onClick={this.createBuild}>manually running a build.</a></h3>
					</div>
				</If>

				<If test={this.state.project && (builds.length || Object.keys(nonCurrentBranches).length)}>
					<div>
						<div className="navbar-collapse collapse navbar-project">
							<div className="nav navbar-nav">
								<If test={this.state.project instanceof Object && (builds.length || Object.keys(nonCurrentBranches).length)}>
									<div className="dropdown">
										<button className={branchButtonClasses} type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
											
											{this.state.currentBranch}

											<If test={nonCurrentBranches.length}>
												<span className="caret"></span>
											</If>
										</button>
										<If test={nonCurrentBranches.length}>
											<ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
												{nonCurrentBranches.map(function(branch) {
													return <li role="presentation"><a role="menuitem" onClick={this.changeBranch} tabindex="-1" href="#">{branch}</a></li>
												}, this)}
											</ul>
										</If>
									</div>
								</If>

								<If test={this.props.UserStore.currentUser && ProjectsStore.isMyProject(this.state.project, this.props.UserStore.currentUser)}>
									<span>
										<If test={!this.state.editingPrimaryBranch}>
											<span onClick={this.toggleEditingPrimaryBranch} className="edit-branch-icon glyphicon glyphicon-edit"></span>
										</If>

										<If test={this.state.editingPrimaryBranch}>
											<span className="edit-branch-form input-group-sm">
												<SelectField
													label=""
													ref="primaryBranchField"
													className="form-control"
													options={editBranches}
													selected={this.state.project && this.state.project.branch}
													onChange={this.changePrimaryBranchField}
													noWrap={true}
												/>
												<button onClick={this.changePrimaryBranch} className="btn btn-sm btn-default">Edit Primary Branch</button>
												<span onClick={this.toggleEditingPrimaryBranch} className="close-edit-branch-icon glyphicon glyphicon-remove"></span>
											</span>
										</If>
									</span>
								</If>
							</div>
						</div>

						<If test={this.state.project instanceof Object && builds.length}>
							<BuildList rerun={this.rerun} currentUser={this.props.UserStore.currentUser} builds={builds} branch={this.state.currentBranch} repository={this.state.project && this.state.project.repository} />
						</If>

						<If test={this.state.project instanceof Object && !builds.length}>
							<div className="no-builds">
								<h3>This branch currently has no builds. Either push to your repository or <a href="" onClick={this.createBuild}>manually run a build.</a></h3>
							</div>
						</If>
					</div>
				</If>
			</div>
        );
    }
}

export default Project;
