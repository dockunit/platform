/*global jQuery */

'use strict';

import React from 'react';
import createProject from '../actions/createProject';
import UserStore from '../stores/UserStore';
import ProjectsStore from '../stores/ProjectsStore';
import ApplicationStore from '../stores/ApplicationStore';
import readGithubRepositories from '../actions/readGithubRepositories';
import readGithubRepoBranches from '../actions/readGithubRepoBranches';
import HelpButton from './HelpButton';
import Help from './Help';
import readMyProjects from '../actions/readMyProjects';
import If from './If';
import InputField from './InputField';
import SelectField from './SelectField';
import SubmitButton from './SubmitButton';
import _ from 'lodash';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['ApplicationStore', 'UserStore', 'ProjectsStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState(),
    UserStore: context.getStore(UserStore).getState(),
    ProjectsStore: context.getStore(ProjectsStore).getState()
}))
class AddProject extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.validateRequired = this.validateRequired.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleRepositoryChange = this.handleRepositoryChange.bind(this);
        this.submit = this.submit.bind(this);
        this.click = this.click.bind(this);
    }

    static contextTypes = {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    }

    state = {
    	repository: {
			value: '',
			errors: {},
			validators: [this.validateRequired('repository')]
		},
		branch: {
			value: '',
			errors: {},
			validators: [this.validateRequired('branch')]
		},
		privateRepository: {
			value: 'No',
			errors: {},
			validators: [this.validateRequired('privateRepository')]
		},
		repositories: false,
		containsDockunitjson: {}
    }

    componentWillMount() {
    	this.context.executeAction(readMyProjects, { mine: true });

        this.context.executeAction(readGithubRepositories, { token: this.props.UserStore.currentUser.githubAccessToken });
    }

	validate(field) {
		var self = this;

		return function() {
			var validators = self.state[field].validators,
				errors = {};

			if (validators.length) {
				for (let i = 0; i < validators.length; i++) {
					errors = _.extend(errors, validators[i].call(self));
				}
			}

			var newState = {};
			newState[field] = _.extend({}, self.state[field]);

			if (errors.required) {
				newState[field].errors = {};
				newState[field].errors.required = errors.required;
			} else {
				newState[field].errors = errors;
			}

			self.setState(newState);

			return newState[field].errors;
		};
	}

	componentWillReceiveProps() {
		var user = this.props.UserStore.currentUser;

		if (user.repositories) {
			var projects = this.props.ProjectsStore.projects;
			var repositories = user.repositories;

			if (repositories && Object.keys(repositories)) {
				for (var repoKey in repositories) {
					if (projects && projects[repoKey]) {
						delete repositories[repoKey];
					}
				}
			}

			var state = {
				projects: projects,
				repositories: repositories
			};

			if (!this.state.repositories && Object.keys(repositories).length) {

				state.repository = {
					value: repositories[Object.keys(repositories)[0]].full_name,
					errors: {},
					validators: this.state.repository.validators
				};

				state.privateRepository = {
					value: (repositories[Object.keys(repositories)[0]].private) ? 'Yes' : 'No',
					errors: {},
					validators: this.state.privateRepository.validators
				};

				this.context.executeAction(readGithubRepoBranches, {
					repository: state.repository.value,
					token: this.props.UserStore.currentUser.githubAccessToken
				});
			}

			if (this.state.repository.value && repositories[this.state.repository.value] && _.size(repositories[this.state.repository.value].branches)) {
				state.branch = {
					value: Object.keys(repositories[this.state.repository.value].branches)[0],
					errors: {},
					validators: this.state.repository.validators
				};

				state.privateRepository = {
					value: (repositories[this.state.repository.value].private) ? 'Yes' : 'No',
					errors: {},
					validators: this.state.privateRepository.validators
				};
			}

			this.setState(state);
		}
	}

	validateRequired(field) {
		var self = this;

		return function() {
			var errors = {};

			if ('' === self.state[field].value) {
				errors.required = 'This field is required.';
			}

			return errors;
		};
	}

	handleFormChange(event) {
		var object = {};
		object[event.target.id] = _.extend({}, this.state[event.target.id]);
		object[event.target.id].value = event.target.value;

		this.setState(object);
	}

	handleRepositoryChange(event) {
		var object = {};
		object[event.target.id] = {
			value: event.target.value,
			errors: this.state[event.target.id].errors,
			validators: this.state[event.target.id].validators
		};

		if (!_.size(this.state.repositories[event.target.value].branches)) {
			this.context.executeAction(readGithubRepoBranches, {
				repository: event.target.value,
				token: this.props.UserStore.currentUser.githubAccessToken
			});
		} else {
			object.branch = {
				value: Object.keys(this.state.repositories[event.target.value].branches)[0],
				errors: {},
				validators: this.state.repository.validators
			};
		}

		object.privateRepository = {
			value: (this.state.repositories[event.target.value].private) ? 'Yes' : 'No',
			errors: {},
			validators: this.state.privateRepository.validators
		};

		this.setState(object);
	}

	submit() {
		this.context.executeAction(createProject, {
			repository: this.state.repository.value,
			branch: this.state.branch.value,
			privateRepository: ('Yes' === this.state.privateRepository.value) ? true : false
		});
	}

	click() {
		var self = this;

		var errors = {};

		['branch', 'repository', 'privateRepository'].forEach(function(field) {
			var newErrors = self.validate.call(self, field)();
			errors = _.extend(errors, newErrors);
		});

		if (Object.keys(errors).length) {
			return false;
		}

		return true;
	}

	componentWillUpdate(props, state) {
		let self = this;
		let containsDockunitjson = self.state.containsDockunitjson;

		if (state.branch.value !== this.state.branch.value) {
			if (state.repository && state.repository.value && state.branch && state.branch.value && 'undefined' === typeof containsDockunitjson[state.repository.value + '/' + state.branch.value]) {

				console.log('checking...');
				jQuery.get('https://api.github.com/repos/' + state.repository.value + '/contents/Dockunit.json?access_token=' + self.props.UserStore.currentUser.githubAccessToken + '&ref=' + state.branch.value).
					done(function() {
						containsDockunitjson[state.repository.value + '/' + state.branch.value] = true;
						self.setState(containsDockunitjson);
					}).
					fail(function() {
						containsDockunitjson[state.repository.value + '/' + state.branch.value] = false;
						self.setState(containsDockunitjson);
					});
			}
		}
	}

	render() {
		let branches = [];
		if (this.state.repository.value && this.state.repositories[this.state.repository.value] && this.state.repositories[this.state.repository.value].branches) {
			branches = Object.keys(this.state.repositories[this.state.repository.value].branches);
		}

		let statuses = ['No', 'Yes'];
		if (this.state.repository.value && this.state.repositories[this.state.repository.value] && this.state.repositories[this.state.repository.value].private) {
			statuses = ['Yes', 'No'];
		}

		let projects = ProjectsStore.filterMyProjects(this.props.ProjectsStore.projects);

		return (
			<div className="container">
				<div className="page-header">
					<div className="help-button-wrapper">
						<HelpButton />
					</div>
					<h1>Create a Project</h1>
				</div>

				<Help>
					<div className="wrap">
						<ul className="help-menu" role="tablist">
							<If test={projects instanceof Object && Object.keys(projects).length === 0}>
								<li role="presentation" className="active"><a href="#add-first-project" data-tab="add-first-project" data-toggle="tab">Your First Project</a></li>
							</If>
							<If test={!(projects instanceof Object && Object.keys(projects).length === 0)}>
								<li role="presentation" className="active"><a href="#add-project-overview" data-tab="add-project-overview" data-toggle="tab">Overview</a></li>
							</If>
							<li role="presentation"><a href="#add-project-repository" data-tab="add-project-repository" data-toggle="tab">Repository</a></li>
							<li role="presentation"><a href="#add-project-branch" data-tab="add-project-branch" data-toggle="tab">Branch</a></li>
							<li role="presentation"><a href="#add-project-private" data-tab="add-project-private" data-toggle="tab">Private</a></li>
						</ul>

						<div className="tab-content">
							<If test={projects instanceof Object && Object.keys(projects).length === 0}>
								<div role="tabpanel" className="first-project active tab-pane" id="add-first-project">
									<h1>Adding Your First Project</h1>

									<p>Dockunit is a simple tool that allows you to test your projects (Github repositories) across any number of environments you define.</p>

									<p><strong>In order for Dockunit.io to work, your project must contain a Dockunit.json file.</strong></p>

									<a href="https://www.npmjs.com/package/dockunit#dockunit-json-examples" className="btn btn-primary btn-lg">Help Me Create a Dockunit.json</a>
								</div>
							</If>

							<If test={!(projects instanceof Object && Object.keys(projects).length === 0)}>
								<div role="tabpanel" className="tab-pane active" id="add-project-overview">
									<h4>Add a Project</h4>

									<p>To begin testing your software, you must create a Dockunit project and associate it with a Github repository. After you create your project, testing will start automatically.</p>
								</div>
							</If>

							<div role="tabpanel" className="tab-pane" id="add-project-repository">
								Every Dockunit project is associated with a Github project
							</div>

							<div role="tabpanel" className="tab-pane" id="add-project-branch">
								The primary branch of a project is the focal point of the project. Dockunit will test all your Github branches but will feature the primary branch a bit more prominantly.
							</div>

							<div role="tabpanel" className="tab-pane" id="add-project-private">
								Private projects wont be accessible to the world. By default the will be visible to anyone who has access to the project in Github. Users will need to create Dockunit.io accounts and associate them with Github accounts in order to access private projects.
							</div>
						</div>
					</div>
				</Help>

				<If test={!this.state.repositories}>
					<div className="loading-section">
						<span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
					</div>
				</If>

				<If test={this.state.repositories && !Object.keys(this.state.repositories).length}>
					<div className="loading-section">
						<h3>Sorry, you either have no Github repositories, or you have already created projects for each repository.</h3>
					</div>
				</If>

				<If test={this.state.repositories && Object.keys(this.state.repositories).length}>
					<form method="post" noValidate>
						<SelectField
							label="Github Repository"
							name="repository"
							onChange={this.handleRepositoryChange}
							className="form-control"
							labelClassName="help-pointer"
							labelHelpTab="add-project-repository"
							id="repository"
							options={Object.keys(this.state.repositories)}
							helpText="Tell us which repository you want to use."
							errors={this.state.repository.errors}
						/>
						
						<SelectField
							label="Primary Repository Branch"
							name="branch"
							className="form-control"
							labelClassName="help-pointer"
							onChange={this.handleFormChange}
							id="branch"
							labelHelpTab="add-project-branch"
							errors={this.state.branch.errors}
							options={branches}
							helpText="This branches status will be featured more prominently in your dashboard."
						/>

						<SelectField
							label="Private"
							name="privateRepository"
							labelClassName="help-pointer"
							labelHelpTab="add-project-private"
							onChange={this.handleFormChange}
							className="form-control"
							id="privateRepository"
							labelHelpNumber="3"
							options={statuses}
							helpText="Private projects will only be viewable to those who have access to the Github project."
							errors={this.state.privateRepository.errors}
						/>

						<input
							type="hidden"
							name="_csrf"
							value={this.props.ApplicationStore.csrfToken}
						/>

						<If test={null === this.state.containsDockunitjson[this.state.repository.value + '/' + this.state.branch.value] || 'undefined' === typeof this.state.containsDockunitjson[this.state.repository.value + '/' + this.state.branch.value]}>
							<div className="alert alert-info alert-large" role="alert">Checking if you have properly added a Dockunit.json file. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></div>
						</If>

						<If test={false === this.state.containsDockunitjson[this.state.repository.value + '/' + this.state.branch.value]}>
							<div className="alert alert-danger alert-large" role="alert">This project does not have a Dockunit.json file. Every project (Github repository) MUST contain a Dockunit.json file. <a href="https://www.npmjs.com/package/dockunit#dockunit-json-examples">Add one?</a></div>
						</If>

						<If test={true === this.state.containsDockunitjson[this.state.repository.value + '/' + this.state.branch.value]}>
							<div className="alert alert-success alert-large" role="alert">Yes! Your project has a Dockunit.json file.</div>
						</If>

						<SubmitButton value="Create Project" repository={this.state.repository.value} onSubmit={this.submit} onClick={this.click} />
					</form>
				</If>
			</div>
		);
	}
}

export default AddProject;
