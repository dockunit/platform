'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import If from './If';
import ProjectsStore from '../stores/ProjectsStore';
import UserStore from '../stores/UserStore';
import readProject from '../actions/readProject';
import BuildList from './BuildList';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['UserStore', 'ProjectsStore'], (context, props) => ({
    UserStore: context.getStore(UserStore).getState(),
    ProjectsStore: context.getStore(ProjectsStore).getState()
}))
class Project extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.changeBranch = this.changeBranch.bind(this);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func
    }

	state = {
		project: null,
		currentBranch: null
	}

	componentDidMount() {
		console.log('hello');
		jQuery(React.findDOMNode(this.refs.buildImage)).popover({
			trigger: 'click',
			placement: 'bottom',
			html: true
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

    	let currentBranch = this.state.currentBranch || '';

    	let buildImageMarkdownContent = "<textarea class='form-control'>[![Dockunit Status](http://dockunit.io/svg/" + this.props.repository + "/" + currentBranch + ")](http://dockunit.io/projects/" + this.props.repository + "/" + currentBranch + ")</textarea>";

        return (
            <div className="container">
            	<h1 className="page-header">
					<If test={this.props.UserStore.currentUser}>
						<NavLink routeName="projects" className="breadcrumb-link">projects</NavLink> 
					</If>

					{this.props.repository} <img ref="buildImage" data-content={buildImageMarkdownContent} title="Build Image Markdown" className="build-image" src={svgUrl} />
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

				<If test={this.state.project && !this.state.project.builds.length}>
					<div className="no-builds">
						<h3>This project currently has no builds. Sorry!</h3>
					</div>
				</If>

				<If test={this.state.project instanceof Object && this.state.project.builds.length}>
					<div>
						<div className="navbar-collapse collapse navbar-project">
							<div className="nav navbar-nav">
								<div className="dropdown">
									<button className={branchButtonClasses} type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
										<If test={nonCurrentBranches.length}>
											<span className="count">({nonCurrentBranches.length + 1})</span>
										</If>
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
							</div>
						</div>

						<BuildList currentUser={this.props.UserStore.currentUser} builds={builds} branch={this.state.currentBranch} repository={this.state.project && this.state.project.repository} />
					</div>
                </If>
			</div>
        );
    }
}

export default Project;
