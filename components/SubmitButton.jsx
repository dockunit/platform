'use strict';

var React = require('react');
var _ = require('lodash');

var SubmitButton = React.createClass({
	getInitialState: function() {
		return {
			classes: 'submit-notification-icon glyphicon'
		}
	},

	onClick: function(event) {
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
	},

	render: function() {
		return (
			<div>
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
});

module.exports = SubmitButton;