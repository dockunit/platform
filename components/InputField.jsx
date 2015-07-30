'use strict';

import React from 'react';
import If from './If';

class Field extends React.Component {
	render() {
		var errorsHTML = [];
		if (this.props.errors) {
			var errorsHTML = Object.keys(this.props.errors).map(function(errorKey) {
				return (
					<div className="error-{errorKey}">{this.props.errors[errorKey]}</div>
				);
			}, this);
		}

		var groupClasses = 'form-group';
		if (errorsHTML.length) {
			groupClasses += ' has-error';
		}

		return (
			<div className={groupClasses}>
				<label for={this.props.id}>{this.props.label}:</label>
				<input
					type={this.props.type}
					className={this.props.className}
					onBlur={this.props.onBlur}
					name={this.props.name}
					id={this.props.id}
					required={this.props.required}
					onChange={this.props.onChange}
				/>

				<If test={this.props.helpText}>
					<span className="help-block">{this.props.helpText}</span>
				</If>

				<div className="errorList">
					{errorsHTML}
				</div>
			</div>
		);
	}
}

export default Field;
