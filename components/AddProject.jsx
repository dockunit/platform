'use strict';

import React from 'react';
import createProject from '../actions/createProject';
import UserStore from '../stores/UserStore';
import ProjectsStore from '../stores/ProjectsStore';
import ApplicationStore from '../stores/ApplicationStore';
import readGithubRepositories from '../actions/readGithubRepositories';
import readGithubRepoBranches from '../actions/readGithubRepoBranches';
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
		repositories: false
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
							name="privateRepository"
							onChange={this.handleFormChange}
							className="form-control"
							id="privateRepository"
							options={statuses}
							helpText="Private projects will only be viewable to those who have access to the Github project."
							errors={this.state.privateRepository.errors}
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
