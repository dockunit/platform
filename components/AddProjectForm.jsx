'use strict';
var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var UserStore = require('../stores/UserStore');
var ProjectsStore = require('../stores/ProjectsStore');
var ApplicationStore = require('../stores/ApplicationStore');
var UserStore = require('../stores/UserStore');
var readGithubRepositories = require('../actions/readGithubRepositories');
var readGithubRepoBranches = require('../actions/readGithubRepoBranches');
var If = require('./If');
var InputField = require('./InputField');
var SelectField = require('./SelectField');
var SubmitButton = require('./SubmitButton');
var _ = require('lodash');

var AddProjectForm = React.createClass({
	mixins: [FluxibleMixin],

	statics: {
		storeListeners: {
			onApplicationStoreChange: [ApplicationStore],
			onUserStoreChange: [UserStore]
		}
	},

	getInitialState: function () {
		this.executeAction(readGithubRepositories, { token: this.getStore(UserStore).getCurrentUser().githubAccessToken });

		return {
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
			private: {
				value: 'No',
				errors: {},
				validators: [this.validateRequired('private')]
			},
			csrf: this.getStore(ApplicationStore).getCsrfToken(),
			repositories: false,
			projects: this.getStore(ProjectsStore).getProjects()
		};
	},

	onApplicationStoreChange: function() {
		var state = {
			csrf: this.getStore(ApplicationStore).getCsrfToken()
		};

		this.setState(state);
	},

	validate: function(field) {
		var self = this;

		return function() {
			var validators = self.state[field].validators,
				errors = {};

			if (validators.length) {
				for (var i = 0; i < validators.length; i++) {
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
	},

	validateRequired: function(field) {
		var self = this;

		return function() {
			var errors = {};

			if ('' === self.state[field].value) {
				errors.required = 'This field is required.';
			}

			return errors;
		};
	},

	onUserStoreChange: function() {
		var user = this.getStore(UserStore).getCurrentUser();

		if (user.repositories) {
			var projects = this.getStore(ProjectsStore).getProjects();
			var repositories = user.repositories;

			if (repositories && Object.keys(repositories)) {
				for (var repoKey in repositories) {
					if (projects[repoKey]) {
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

				state.private = {
					value: repositories[Object.keys(repositories)[0]].private,
					errors: {},
					validators: this.state.private.validators
				};

				this.executeAction(readGithubRepoBranches, {
					repository: state.repository.value,
					token: this.getStore(UserStore).getCurrentUser().githubAccessToken
				});
			}

			if (this.state.repository.value && repositories[this.state.repository.value] && _.size(repositories[this.state.repository.value].branches)) {
				state.branch = {
					value: Object.keys(repositories[this.state.repository.value].branches)[0],
					errors: {},
					validators: this.state.repository.validators
				};

				state.private = {
					value: repositories[this.state.repository.value].private,
					errors: {},
					validators: this.state.private.validators
				};
			}

			this.setState(state);
		}
	},

	handleFormChange: function(event) {
		var object = {};
		object[event.target.id] = _.extend({}, this.state[event.target.id]);
		object[event.target.id].value = event.target.value;

		this.setState(object);
	},

	handleRepositoryChange: function(event) {
		var object = {};
		object[event.target.id] = {
			value: event.target.value,
			errors: this.state[event.target.id].errors,
			validators: this.state[event.target.id].validators
		};

		if (!_.size(this.state.repositories[event.target.value].branches)) {
			this.executeAction(readGithubRepoBranches, {
				repository: event.target.value,
				token: this.getStore(UserStore).getCurrentUser().githubAccessToken
			});
		} else {
			object.branch = {
				value: Object.keys(this.state.repositories[event.target.value].branches)[0],
				errors: {},
				validators: this.state.repository.validators
			};
		}

		object.private = {
			value: this.state.repositories[event.target.value].private,
			errors: {},
			validators: this.state.private.validators
		};

		this.setState(object);
	},

	submit: function() {
		this.props.onAdd({
			repository: this.state.repository.value,
			branch: this.state.branch.value,
			private: ('Yes' === this.state.private.value) ? true : false
		});
	},

	click: function() {
		var self = this;

		var errors = {};

		['branch', 'repository', 'private'].forEach(function(field) {
			var newErrors = self.validate.call(self, field)();
			errors = _.extend(errors, newErrors);
		});

		if (Object.keys(errors).length) {
			return false;
		}

		return true;
	},

	render: function() {
		var branches = [];
		if (this.state.repository.value && this.state.repositories[this.state.repository.value] && this.state.repositories[this.state.repository.value].branches) {
			branches = Object.keys(this.state.repositories[this.state.repository.value].branches);
		}

		var statuses = ['No', 'Yes'];
		if (this.state.repository.value && this.state.repositories[this.state.repository.value] && this.state.repositories[this.state.repository.value].private) {
			statuses = ['Yes', 'No'];
		}

		return (
			<div className="container">
				<div className="page-header">
					<h1>Create a Project</h1>
				</div>

				<If test={!this.state.repositories}>
					<div className="loading-section">
						<h3>Hey there, we are looking up your Github repositories. <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
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
							id="repository"
							options={Object.keys(this.state.repositories)}
							helpText="Tell us which repository you want to use."
							errors={this.state.repository.errors}
						/>
						
						<SelectField
							label="Primary Repository Branch"
							name="branch"
							className="form-control"
							onChange={this.handleFormChange}
							id="branch"
							errors={this.state.branch.errors}
							options={branches}
							helpText="This branches status will be featured more prominently in your dashboard."
						/>

						<SelectField
							label="Private"
							name="private"
							onChange={this.handleFormChange}
							className="form-control"
							id="private"
							options={statuses}
							helpText="Private projects will only be viewable to those who have access to the Github project."
							errors={this.state.private.errors}
						/>

						<input
							type="hidden"
							name="_csrf"
							value={this.state.csrf}
						/>

						<SubmitButton value="Create Project" repository={this.state.repository.value} onSubmit={this.submit} onClick={this.click} />
					</form>
				</If>
			</div>
			);
	}
});

module.exports = AddProjectForm;
