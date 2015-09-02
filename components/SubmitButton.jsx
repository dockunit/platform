'use strict';

import React from 'react';
import _ from 'lodash';

class SubmitButton extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.onClick = this.onClick.bind(this);
	}

	state = {
		classes: 'submit-notification-icon glyphicon'
	}

	onClick(event) {
		var self = this;
		event.preventDefault();

		if (!self.props.onClick()) {
			self.setState({ classes: self.state.classes + ' errors glyphicon-remove' });

			setTimeout(_.throttle(function() {
				self.setState({ classes: self.state.classes.replace(/errors glyphicon-remove/g, '') });
			}, 2000), 1000);
		} else {
			self.setState({ classes: self.state.classes + ' ok glyphicon-ok' });

			setTimeout(_.throttle(function() {
				if (self.props.onSubmit) {
					self.props.onSubmit();
				}
			}, 2000), 1000);
		}
	}

	render() {
		return (
			<div className={this.props.className}>
				<input
					type="submit"
					className="btn btn-lg btn-primary"
					value={this.props.value}
					onClick={this.onClick}
				/>
				<span className={this.state.classes}></span>
			</div>
		);
	}
}

export default SubmitButton;