'use strict';

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var React = require('react');
var BuildList = require('./BuildList');
var If = require('./If');
var ProjectsStore = require('../stores/ProjectsStore');
var NavLink = require('flux-router-component').NavLink;
var readProject = require('../actions/readProject');

var Project = React.createClass({
	mixins: [FluxibleMixin],

	statics: {
		storeListeners: {
			onProjectsStoreChange: [ProjectsStore]
		}
	},

	onProjectsStoreChange: function() {
		var projects = this.getStore(ProjectsStore).getProjects(),
			state = {};

		if (projects && projects[this.props.repository]) {
			state.project = projects[this.props.repository];

			if (!this.statecurrentBranch) {
				state.currentBranch = projects[this.props.repository].branch;
			}
		} else {
			state.project = false;
		}

		this.setState(state);
	},

	getInitialState: function() {
		var projects = this.getStore(ProjectsStore).getProjects();

		var state = {
			project: null,
			currentBranch: null
		};

		if (projects && projects[this.props.repository]) {
			state.project = projects[this.props.repository];
			state.currentBranch = state.project.branch;
		} else {
			this.executeAction(readProject, { repository: this.props.repository });
		}

		return state;
	},

	changeBranch: function(event) {
		event.preventDefault();

		this.setState({ currentBranch: event.target.innerText });
	},

    render: function() {
    	var nonCurrentBranches = [],
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

    	var branchButtonClasses = 'btn btn-sm dropdown-toggle';
    	if (!nonCurrentBranches.length) {
    		branchButtonClasses += ' one-branch';
    	}

        return (
            <div className="container">
				<h1 className="page-header"><NavLink routeName="projects" className="breadcrumb-link">projects</NavLink> {this.props.repository}</h1>

				<If test={false === this.state.project}>
					<div className="no-projects">
						<h3>We couldn't find this project. Maybe you don't have access?</h3>
					</div>
				</If>

				<If test={null === this.state.project}>
					<div className="loading-section">
						<h2>Hey there, we are loading your project. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h2>
					</div>
				</If>

				<If test={this.state.project && !this.state.project.builds.length}>
					<div className="no-builds">
						<h2>This project currently has no builds. Sorry!</h2>
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

						<BuildList builds={builds} branch={this.state.currentBranch} repository={this.state.project && this.state.project.repository} />
					</div>
                </If>
			</div>
        );
    }
});

module.exports = Project;
