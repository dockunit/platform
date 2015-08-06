'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';

class LatestBuildListItem extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.toggleBuildDetails = this.toggleBuildDetails.bind(this);
    }

	state = {
		showBuildDetails: false
	}

	toggleBuildDetails() {
		this.setState({ showBuildDetails: !this.state.showBuildDetails });
	}

	render() {
		let statusClasses = 'status glyphicon ';
		let userUrl = 'https://github.com/' + this.props.build.commitUser;
		let githubUrl = 'https://github.com/' + this.props.repository;
		let repositoryName = this.props.repository.replace(/^.*?\/(.*)$/i, '$1');
		let  dockunitUrl = githubUrl + '/blob/' + this.props.branch + '/Dockunit.json';

		if (this.props.build.finished) {
			if (255 === this.props.build.result) {
				statusClasses += 'glyphicon-exclamation-sign';
			} else if (0 < this.props.build.result) {
				statusClasses += 'glyphicon-remove';
			} else {
				statusClasses += 'glyphicon-ok';
			}
		} else {
			statusClasses += 'glyphicon-option-horizontal';
		}

		var buildDetailsClasses = 'build-details ';
    	if (!this.state.showBuildDetails) {
    		buildDetailsClasses += 'hide';
    	}

    	var buildShortCommit = this.props.build.commit.replace(/^([a-z0-9]{0,9}).*$/i, '$1');
    	var commitUrl = githubUrl + '/commit/' + this.props.build.commit;
    	var buildIdShort = this.props.build._id.replace(/^([a-z0-9]{0,9}).*$/i, '$1');
    	
    	var passFail = 'Passed';
    	if (255 === this.props.build.result) {
    		passFail = 'Errored';
    	} else if (0 < this.props.build.result) {
    		passFail = 'Failed';
    	}

    	var runTime = '';
    	if (this.props.build.finished) {
    		var runTimeCalc = ((new Date(this.props.build.finished) - new Date(this.props.build.ran)) / 1000 / 60);

			if (runTimeCalc < 1) {
				runTimeCalc = Math.floor(runTimeCalc * 60);

				runTime = runTimeCalc + ' second' + ((runTimeCalc > 1 || 0 === runTimeCalc) ? 's' : '');
			} else {
				var runTimeCalc = Math.floor(runTimeCalc);

				runTime = runTimeCalc + ' minute' + ((runTimeCalc > 1 || 0 === runTimeCalc) ? 's' : '');
			}
    	}

    	var output = this.props.build.output.trim().replace(/^(\r\n|\n|\r)/g, '').replace(/(?:\r\n|\r|\n)/g, '<br />');

		return (
			<div className="project-item latest-build jumbo">
				<div className="main">
					<span className={statusClasses}></span>

					<div className="left">
						<h2>Build #{buildIdShort}</h2>

						<div className="item">
							<If test={this.props.build.result === 255 && this.props.build.finished}>
								<div>Status: <strong>No Dockunit.json file found</strong></div>
							</If>

							<If test={this.props.build.result !== 255 && this.props.build.finished}>
								<div>Status: <strong>{passFail} in {runTime}</strong></div>
							</If>

							<If test={!this.props.build.finished}>
								<div>Status: <strong>Not finished</strong></div>
							</If>
						</div>
					</div>

					<div className="right">
						<div className="item">Last ran <strong>{timeago(this.props.build.ran)}</strong></div>
						<div className="item">Commit <a href={commitUrl}><strong>{buildShortCommit}</strong></a> by <a href={userUrl}><strong>{this.props.build.commitUser}</strong></a></div>

						<div className="toolbar">
							<If test={this.props.currentUser}>
								<a className="btn btn-default" href="">Rerun <span className="glyphicon glyphicon-refresh"></span></a>
							</If>

							<a className="btn btn-default" href={dockunitUrl}>Dockunit.json <span className="icomoon icomoon-anchor"></span></a>
							<a className="btn btn-default" href={githubUrl}>Repo <span className="icomoon icomoon-github"></span></a>
							<a className="btn btn-default expand" onClick={this.toggleBuildDetails}>
								Build Details 
								<If test={this.state.showBuildDetails}>
									<span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
								</If>

								<If test={!this.state.showBuildDetails}>
									<span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
								</If>
							</a>
						</div>
					</div>
				</div>

				<div className={buildDetailsClasses}>
					<div className="output" dangerouslySetInnerHTML={{__html: output}}>
					</div>
				</div>
			</div>
		);
	}
}

export default LatestBuildListItem;
