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

		let labelClasses = this.props.labelClassName || '';
		if (this.props.required) {
			labelClasses += ' required';
		}

		return (
			<div className={groupClasses}>
				<If test={this.props.label}>
					<label className={labelClasses} data-help-tab={this.props.labelHelpTab} for={this.props.id}>{this.props.label}:</label>
				</If>

				<If test={this.props.options.length}>
					<select
						className={this.props.className}
						ref={this.props.ref}
						onBlur={this.props.onBlur}
						name={this.props.name}
						id={this.props.id}
						required={this.props.required}
						multiple={this.props.multiple}
						onChange={this.props.onChange}
					>
						{this.props.options.map(function(label) {
							let selected = (this.props.selected && this.props.selected === label) ? true : false;
	                        return <option selected={selected}>{label}</option>        
	                    }, this)}
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
