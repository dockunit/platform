'use strict';

import React from 'react';
import LoginForm from './LoginForm';

class Login extends React.Component {

	render() {
		return (
			<div className="container login">
				<h2>Login</h2>

				<LoginForm />
			</div>
		);
	}
}

export default Login;
