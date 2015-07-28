'use strict';

import React from 'react';
import createProject from '../actions/createProject';
import UserStore from '../stores/UserStore';
import ProjectsStore from '../stores/ProjectsStore';
import ApplicationStore from '../stores/ApplicationStore';
import readGithubRepositories from '../actions/readGithubRepositories';
import readGithubRepoBranches from '../actions/readGithubRepoBranches';
import If from './If';
import InputField from './InputField';
import SelectField from './SelectField';
import SubmitButton from './SubmitButton';
import _ from 'lodash';
import {connectToStores, provideContext} from 'fluxible-addons-react';

@connectToStores([ApplicationStore, UserStore, ProjectsStore], (context, props) => ({
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
		private: {
			value: 'No',
			errors: {},
			validators: [this.validateRequired('private')]
		},
		repositories: false
    }

    componentWillMount() {
        this.context.executeAction(readGithubRepositories, { token: this.context.UserStore.currentUser.githubAccessToken });
    }

	validate(field) {
		var self = this;

		return function() {
			var validators = self.props[field].validators,
				errors = {};

			if (validators.length) {
				for (var i = 0; i < validators.length; i++) {
					errors = _.extend(errors, validators[i].call(self));
				}
			}

			var newState = {};
			newState[field] = _.extend({}, self.props[field]);

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

	validateRequired(field) {
		var self = this;

		return function() {
			var errors = {};

			if ('' === self.props[field].value) {
				errors.required = 'This field is required.';
			}

			return errors;
		};
	}

	_onChange() {
		var user = this.context.UserStore.currentUser;

		if (user.repositories) {
			var projects = this.context.ProjectsStore.projects;
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

			if (!this.props.repositories && Object.keys(repositories).length) {

				state.repository = {
					value: repositories[Object.keys(repositories)[0]].full_name,
					errors: {},
					validators: this.props.repository.validators
				};

				state.private = {
					value: (repositories[Object.keys(repositories)[0]].private) ? 'Yes' : 'No',
					errors: {},
					validators: this.props.private.validators
				};

				this.context.executeAction(readGithubRepoBranches, {
					repository: state.repository.value,
					token: this.context.UserStore.getCurrentUser().githubAccessToken
				});
			}

			if (this.props.repository.value && repositories[this.props.repository.value] && _.size(repositories[this.props.repository.value].branches)) {
				state.branch = {
					value: Object.keys(repositories[this.props.repository.value].branches)[0],
					errors: {},
					validators: this.props.repository.validators
				};

				state.private = {
					value: (repositories[this.props.repository.value].private) ? 'Yes' : 'No',
					errors: {},
					validators: this.props.private.validators
				};
			}

			this.setState(state);
		}
	}

	handleFormChange(event) {
		var object = {};
		object[event.target.id] = _.extend({}, this.props[event.target.id]);
		object[event.target.id].value = event.target.value;

		this.setState(object);
	}

	handleRepositoryChange(event) {
		var object = {};
		object[event.target.id] = {
			value: event.target.value,
			errors: this.props[event.target.id].errors,
			validators: this.props[event.target.id].validators
		};

		if (!_.size(this.props.repositories[event.target.value].branches)) {
			this.context.executeAction(readGithubRepoBranches, {
				repository: event.target.value,
				token: this.context.UserStore.getCurrentUser().githubAccessToken
			});
		} else {
			object.branch = {
				value: Object.keys(this.props.repositories[event.target.value].branches)[0],
				errors: {},
				validators: this.props.repository.validators
			};
		}

		object.private = {
			value: (this.props.repositories[event.target.value].private) ? 'Yes' : 'No',
			errors: {},
			validators: this.props.private.validators
		};

		this.setState(object);
	}

	submit() {
		this.context.executeAction(createProject, {
			repository: this.props.repository.value,
			branch: this.props.branch.value,
			private: ('Yes' === this.props.private.value) ? true : false
		});
	}

	click() {
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
	}

	render() {
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
							errors={this.props.private.errors}
						/>

						<input
							type="hidden"
							name="_csrf"
							value={this.props.ApplicationStore.csrfToken}
						/>

						<SubmitButton value="Create Project" repository={this.state.repository.value} onSubmit={this.submit} onClick={this.click} />
					</form>
				</If>
			</div>
		);
	}
}

export default AddProject;
