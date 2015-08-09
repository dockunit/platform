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
import readGithubRepoBranches from '../actions/readGithubRepoBranches';
import SelectField from './SelectField';

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
			repository: this.props.repository
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
				textarea.value = '[![Dockunit Status](http://dockunit.io/svg/' + self.props.repository + '/' + currentBranch + ')](http://dockunit.io/projects/' + self.props.repository + '/' + currentBranch + ')';

				return textarea;
			}
		});
	}

	componentWillReceiveProps() {
		let projects = this.props.ProjectsStore.projects,
			state = {};

		if (projects && projects[this.props.repository]) {
			state.project = projects[this.props.repository];
			state.currentBranch = state.project.branch;

			if (!this.state.currentBranch) {
				state.currentBranch = projects[this.props.repository].branch;
			}

			state.primaryBranchField = state.project.branch;

			this.setState(state);
		} else {
			if (this.props.ProjectsStore.projectsNotFound[this.props.repository]) {
				state.project = false;
				this.setState(state);
			}
			this.context.executeAction(readProject, { repository: this.props.repository });
		}
	}

	changeBranch(event) {
		event.preventDefault();

		this.setState({ currentBranch: event.target.innerText });
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
    		svgUrl += '/' + this.state.currentBranch;
    	}
    	svgUrl += '?' + new Date().getTime();

    	let currentBranch = this.state.currentBranch || '';

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
            	<h1 className="page-header">
					<If test={this.props.UserStore.currentUser}>
						<NavLink routeName="projects" className="breadcrumb-link">projects</NavLink> 
					</If>

					{this.props.repository} <img ref="buildImage" title="Build Image Markdown" className="build-image" src={svgUrl} />
				</h1>

				<If test={false === this.state.project}>
					<div className="no-projects">
						<h3>We couldn't find this project. Maybe you don't have access?</h3>
					</div>
				</If>

				<If test={null === this.state.project}>
					<div className="loading-section">
						<h3>Hey there, we are loading your project. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
					</div>
				</If>

				<If test={this.state.project && !builds.length && !Object.keys(nonCurrentBranches).length}>
					<div className="no-builds">
						<h3>This project currently has no builds. Sorry!</h3>
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
													selected={this.state.currentBranch}
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
							<BuildList currentUser={this.props.UserStore.currentUser} builds={builds} branch={this.state.currentBranch} repository={this.state.project && this.state.project.repository} />
						</If>

						<If test={this.state.project instanceof Object && !builds.length}>
							<div className="no-builds">
								<h3>This branch currently has no builds. Sorry!</h3>
							</div>
						</If>
					</div>
				</If>
			</div>
        );
    }
}

export default Project;
