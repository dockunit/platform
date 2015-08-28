'use strict';

import React from 'react';
import LoginForm from './LoginForm';

class Login extends React.Component {

	render() {
		let redirectPath = (this.props.redirectPath) ? this.props.redirectPath : '/';

		return (
			<div className="container login">
				<h2>Log In</h2>

				<LoginForm redirectPath={redirectPath} />
			</div>
		);
	}
}

export default Login;
