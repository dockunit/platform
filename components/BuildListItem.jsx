'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';

class BuildListItem extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.toggleBuildDetails = this.toggleBuildDetails.bind(this);
        this.rerun = this.rerun.bind(this);
    }

	state = {
		showBuildDetails: false
	}

	rerun(event) {
		event.preventDefault();

		this.setState({ showBuildDetails: false });
		
		this.props.rerun(this.props.build._id);
	}

	toggleBuildDetails(event) {
		event.preventDefault();

		this.setState({ showBuildDetails: !this.state.showBuildDetails });
	}

	render() {
		let statusClasses = 'status ';
		let githubUrl = 'https://github.com/' + this.props.repository;
		let dockunitUrl = githubUrl + '/blob/' + this.props.branch + '/Dockunit.json';

		if (this.props.build.finished) {
			if (255 === this.props.build.result) {
				statusClasses += 'failed';
			} else if (0 < this.props.build.result) {
				statusClasses += 'errored';
			} else {
				statusClasses += 'passed';
			}
		} else {
			statusClasses += 'running';
		}

		let buildDetailsClasses = 'build-details ';
    	if (!this.state.showBuildDetails) {
    		buildDetailsClasses += 'hide';
    	}

    	let buildShortCommit = this.props.build.commit.replace(/^([a-z0-9]{0,9}).*$/i, '$1');
    	let commitUrl = githubUrl + '/commit/' + this.props.build.commit;
    	let buildIdShort = this.props.build._id.replace(/^([a-z0-9]{0,9}).*$/i, '$1');

    	let output = this.props.build.output
    		.replace(/&/g, '&amp;')
    		.replace(/>/g, '&gt;')
    		.replace(/</g, '&lt;');
    	output = output.trim().replace(/^(\r\n|\n|\r)/g, '').replace(/(?:\r\n|\r|\n)/g, '<br />');
		
    	let rerunDisabled = (this.props.build.started && this.props.build.finished) ? false : true;

    	let lastRan = '';
		if (!this.props.build.started && !this.props.build.finished) {
			lastRan = 'Queued to run';
		} else if (this.props.build.started && !this.props.build.finished) {
			lastRan = 'Started ' + timeago(this.props.build.started);
		}  else if (this.props.build.started && this.props.build.finished) {
			lastRan = 'Finished ' + timeago(this.props.build.started);
		}

		return (
			<div className="build-item">
				<div className={statusClasses}>
				</div>

				<div className="left">
					<strong>Build #{buildIdShort}</strong> @ Commit <a href={commitUrl}><strong>{buildShortCommit}</strong></a>
				</div>
				
				<div className="right">
					<strong>{lastRan}</strong>
					<If test={this.props.build.finished}>
						<a onClick={this.toggleBuildDetails} className="expand" href=""><span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a>
					</If>
				</div>

				<div className={buildDetailsClasses}>
					<div className="toolbar">
						<If test={this.props.currentUser}>
							<a onClick={this.rerun} disabled={rerunDisabled} className="btn btn-default" href="">Rerun <span className="glyphicon glyphicon-refresh"></span></a>
						</If>

						<a className="btn btn-default" href={dockunitUrl}>Dockunit.json <span className="icomoon icomoon-anchor"></span></a>
						<a className="btn btn-default" href={githubUrl}>Repo <span className="icomoon icomoon-github"></span></a>
					</div>
					<div className="output" dangerouslySetInnerHTML={{__html: output}}>
					</div>
				</div>
			</div>
		);
	}
}

export default BuildListItem;
