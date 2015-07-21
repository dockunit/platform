'use strict';
var React = require('react');
var RegisterForm = require('./RegisterForm.jsx');
var UserStore = require('../stores/UserStore');
var createUser = require('../actions/createUser');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var navigate = require('flux-router-component').navigateAction;

var Register = React.createClass({
	mixins: [FluxibleMixin],

	register: function(user) {
		this.executeAction(createUser, user);
	},

	success: function() {
		this.executeAction(navigate, {
	        url: '/login'
	    });
	},

	render: function() {
		return (
			<div>
				<div className="jumbotron jumbotron-page">
					<h1>Get Started Now</h1>
					<p className="lead">Dockunit.io is super awesome. We promise.</p>
					<p><a className="btn btn-lg btn-primary" href="/" role="button">Not Convinced?</a></p>
				</div>

				<div className="container">
					<RegisterForm onRegister={this.register} onSuccess={this.success} />
				</div>
			</div>
		);
	}
});

module.exports = Register;
