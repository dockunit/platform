'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';

class BuildListItem extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.toggleBuildDetails = this.toggleBuildDetails.bind(this);
    }

	state = {
		showBuildDetails: false
	}

	toggleBuildDetails(event) {
		event.preventDefault();

		this.setState({ showBuildDetails: !this.state.showBuildDetails });
	}

	render() {
		let statusClasses = 'status ';
		let userUrl = 'https://github.com/' + this.props.build.commitUser;
		let githubUrl = 'https://github.com/' + this.props.repository;
		let repositoryName = this.props.repository.replace(/^.*?\/(.*)$/i, '$1');
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

		var buildDetailsClasses = 'build-details ';
    	if (!this.state.showBuildDetails) {
    		buildDetailsClasses += 'hide';
    	}

    	var buildShortCommit = this.props.build.commit.replace(/^([a-z0-9]{0,9}).*$/i, '$1');
    	var commitUrl = githubUrl + '/commit/' + this.props.build.commit;
    	var buildIdShort = this.props.build._id.replace(/^([a-z0-9]{0,9}).*$/i, '$1');
    	var passFail = (this.props.build.result) ? 'Passed' : 'Failed';

    	var output = this.props.build.output.trim().replace(/^(\r\n|\n|\r)/g, '').replace(/(?:\r\n|\r|\n)/g, '<br />');

		return (
			<div className="build-item">
				<div className={statusClasses}>
				</div>

				<div className="left">
					<strong>Build #{buildIdShort}</strong> @ Commit <a href={commitUrl}><strong>{buildShortCommit}</strong></a>
				</div>
				
				<div className="right">
					Last ran <strong>{timeago(this.props.build.ran)}</strong>
					<If test={this.props.build.finished}>
						<a onClick={this.toggleBuildDetails} className="expand" href=""><span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a>
					</If>
				</div>

				<div className={buildDetailsClasses}>
					<div className="toolbar">
						<If test={this.props.currentUser}>
							<a className="btn btn-default" href="">Rerun <span className="glyphicon glyphicon-refresh"></span></a>
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
