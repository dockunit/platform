'use strict';

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var React = require('react');
var BuildList = require('./BuildList');
var If = require('./If');
var ProjectsStore = require('../stores/ProjectsStore');
var NavLink = require('flux-router-component').NavLink;

var Project = React.createClass({
	mixins: [FluxibleMixin],

	statics: {
		storeListeners: {
			onProjectsStoreChange: [ProjectsStore]
		}
	},

	onProjectsStoreChange: function() {
		var projects = this.getStore(ProjectsStore).getProjects();

		if (projects) {
			var state = { project: projects[this.props.repository] };

			if (!this.statecurrentBranch) {
				state.currentBranch = projects[this.props.repository].branch;
			}

			this.setState(state);
		}
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

				<If test={this.state.project instanceof Object && Object.keys(this.state.project).length === 0}>
					<div className="no-project">
						<h2>An error has occured. Sorry!</h2>
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
