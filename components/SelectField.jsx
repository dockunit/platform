'use strict';

import React from 'react';
import If from './If';

class SelectField extends React.Component {
	render() {
		var errorsHTML = [];
		if (this.props.errors) {
			var errorsHTML = Object.keys(this.props.errors).map(function(errorKey) {
				return (
					<div className="error-{errorKey}">{this.props.errors[errorKey]}</div>
				);
			}, this);
		}


		let groupClasses = 'select-wrap';
		if (!this.props.noWrap) {
			groupClasses += ' form-group';
		}

		if (errorsHTML.length) {
			groupClasses += ' has-error';
		}

		return (
			<div className={groupClasses}>
				<If test={this.props.label}>
					<label for={this.props.id}>{this.props.label}:</label>
				</If>

				<If test={this.props.options.length}>
					<select
						className={this.props.className}
						ref={this.props.ref}
						onBlur={this.props.onBlur}
						name={this.props.name}
						id={this.props.id}
						required={this.props.required}
						onChange={this.props.onChange}
					>
						{this.props.options.map(function(label) {
	                        return <option>{label}</option>        
	                    })}
					</select>
				</If>

				<If test={!this.props.options.length}>
					<div className="loading-section inline">
						One moment please <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
					</div>
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

export default SelectField;
