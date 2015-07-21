'use strict';
var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var UserStore = require('../stores/UserStore');
var ApplicationStore = require('../stores/ApplicationStore');
var userExists = require('../actions/userExists');
var InputField = require('./InputField');
var SubmitButton = require('./SubmitButton');

var RegisterForm = React.createClass({
	mixins: [FluxibleMixin],

	statics: {
		storeListeners: {
			onApplicationStoreChange: [ApplicationStore],
			onUserStoreChange: [UserStore]
		}
	},

	getInitialState: function () {
		return {
			username: {
				value: '',
				errors: {},
				validators: [this.validateRequired('username'), this.validateUsername]
			},
			firstName: {
				value: '',
				errors: {},
				validators: []
			},
			lastName: {
				value: '',
				errors: {},
				validators: []
			},
			email: {
				value: '',
				errors: {},
				validators: [this.validateRequired('email'), this.validateEmail]
			},
			password: {
				value: '',
				errors: {},
				validators: [this.validateRequired('password'), this.validatePassword]
			},
			csrf: this.getStore(ApplicationStore).getCsrfToken()
		};
	},

	onApplicationStoreChange: function() {
		this.csrf = this.getStore(ApplicationStore).getCsrfToken();
	},

	onUserStoreChange: function() {
		this.userCache = this.getStore(UserStore).getUserCache();

		if (this.userCache[this.state.username.value]) {
			var newState = {};
			newState.username = _.extend({}, this.state.username);
			newState.username.errors.taken = 'This username is already in use.';

			this.setState(newState);
		}
	},

	handleFormChange: function(event) {
		var object = {};
		object[event.target.id] = _.extend({}, this.state[event.target.id]);
		object[event.target.id].value = event.target.value;

		this.setState(object);
	},

	submit: function() {
		var self = this;

		var errors = {};

		['username', 'password', 'lastName', 'firstName', 'email'].forEach(function(field) {
			var newErrors = self.validate.call(self, field)();
			errors = _.extend(errors, newErrors);
		});

		if (Object.keys(errors).length) {
			return false;
		}

		this.props.onRegister({
			username: self.state.username.value,
			password: self.state.password.value,
			email: self.state.email.value,
			firstName: self.state.firstName.value,
			lastName: self.state.lastName.value
		});

		return true;
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

	validateUsername: function() {
		this.executeAction(userExists, { username: this.state.username.value });

		return true;
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

	validatePassword: function() {
		var errors = {};

		if (this.state.password.value.length < 7) {
			errors.short = 'Your password must be at least 7 characters long.';
		}

		return errors;
	},

	validateEmail: function() {
		var errors = {};

		if (this.state.email.value.length) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (! re.test(this.state.email.value)) {
				errors.format = 'This is not a valid email address.';
			}
		}

		return errors;
	},



	render: function() {
		return (
			<div>
				<p>
					Signing up for Dockunit.io is quick, easy, and best of all free. After you setup your account, we will help you connect your repositories so you can start continuous integration tests immediatly.
				</p>
				<div className="row">
					<form method="post" noValidate>
						<div className="col-md-4">
							<InputField
								label="Username"
								required="true"
								onChange={this.handleFormChange}
								value={this.state.username.value}
								type="text"
								onBlur={this.validate('username')}
								name="username"
								className="form-control"
								id="username"
								errors={this.state.username.errors}
							/>
							<InputField
								label="Password"
								type="password"
								required="true"
								className="form-control"
								onBlur={this.validate('password')}
								name="password"
								id="password"
								onChange={this.handleFormChange}
								errors={this.state.password.errors}
							/>
						</div>
						<div className="col-md-4">
							<InputField
								label="First Name"
								onChange={this.handleFormChange}
								value={this.state.firstName.value}
								type="text"
								onBlur={this.validate('firstName')}
								name="firstName"
								className="form-control"
								id="firstName"
							/>
							<InputField
								label="Last Name"
								value={this.state.lastName.value}
								onChange={this.handleFormChange}
								type="text"
								onBlur={this.validate('lastName')}
								name="lastName"
								className="form-control"
								id="lastName"
							/>
						</div>
						<div className="col-md-4">
							<InputField
								label="Email"
								value={this.state.email.value}
								required="true"
								onChange={this.handleFormChange}
								onBlur={this.validate('email')}
								type="text"
								className="form-control"
								name="email"
								errors={this.state.email.errors}
								id="email"
							/>
							<input
								type="hidden"
								name="_csrf"
								value={this.state.csrf}
							/>

							<SubmitButton value="Sign Up" onSuccess={this.props.onSuccess} onClick={this.submit} />
						</div>
					</form>
				</div>
			</div>
		);
	}
});

module.exports = RegisterForm;
