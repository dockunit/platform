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

		let labelClasses = '';
		if (this.props.required) {
			labelClasses += 'required';
		}

		return (
			<div className={groupClasses}>
				<label className={labelClasses} for={this.props.id}>{this.props.label}:</label>

				<If test={'textarea' === this.props.type}>
					<textarea
						className={this.props.className}
						onBlur={this.props.onBlur}
						name={this.props.name}
						id={this.props.id}
						rows={this.props.rows}
						required={this.props.required}
						onChange={this.props.onChange}
					>
					</textarea>
				</If>

				<If test={'textarea' !== this.props.type}>
					<input
						type={this.props.type}
						className={this.props.className}
						onBlur={this.props.onBlur}
						name={this.props.name}
						id={this.props.id}
						required={this.props.required}
						onChange={this.props.onChange}
					/>
				</If>

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
