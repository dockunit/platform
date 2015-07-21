'use strict';
var React = require('react');
var LoginForm = require('./LoginForm.jsx');

var Login = React.createClass({

	render: function() {
		return (
			<div className="container login">
				<h2>Login</h2>

				<LoginForm />
			</div>
			);
	}
});

module.exports = Login;
