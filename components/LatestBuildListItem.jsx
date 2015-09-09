'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';

class LatestBuildListItem extends React.Component {
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

	toggleBuildDetails() {
		this.setState({ showBuildDetails: !this.state.showBuildDetails });
	}

	render() {
		let statusClasses = 'status glyphicon ';
		let userUrl = 'https://github.com/' + this.props.build.commitUser;
		let githubUrl = 'https://github.com/' + this.props.repository;
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

    	// Very hacky way of handling special entities
    	let output = this.props.build.output
    		.replace(/\<span(.*?)\>/gi, '[#%span$1]')
    		.replace(/\<\/span\>/gi, '[#%/span]')
    		.replace(/&/g, '&amp;')
    		.replace(/\>/g, '&gt;')
    		.replace(/\</g, '&lt;')
    		.replace(/\[#%span(.*?)\]/g, '<span$1>')
    		.replace(/\[#%\/span\]/g, '</span>');

    	output = output.trim().replace(/^(\r\n|\n|\r)/g, '').replace(/(?:\r\n|\r|\n)/g, '<br />');

		
    	let buildDetailsButtonsClasses = "btn btn-default expand";
    	if (!this.props.build.finished) {
    		buildDetailsButtonsClasses += ' disabled';
    	}

    	let lastRan = '';
		if (!this.props.build.ran && !this.props.build.finished) {
			lastRan = 'Queued to run';
		} else if (this.props.build.ran && !this.props.build.finished) {
			lastRan = 'Started ' + timeago(this.props.build.ran);
		}  else if (this.props.build.ran && this.props.build.finished) {
			lastRan = 'Finished ' + timeago(this.props.build.ran);
		}

    	let rerunDisabled = (this.props.build.ran && this.props.build.finished) ? false : true;

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

							<If test={!this.props.build.finished && this.props.build.ran}>
								<div>Status: <strong>Not finished</strong></div>
							</If>

							<If test={!this.props.build.finished && !this.props.build.ran}>
								<div>Status: <strong>Waiting to run</strong></div>
							</If>
						</div>
					</div>

					<div className="right">
						<div className="item"><strong>{lastRan}</strong></div>
						<div className="item">Commit <a href={commitUrl}><strong>{buildShortCommit}</strong></a> by <a href={userUrl}><strong>{this.props.build.commitUser}</strong></a></div>

						<div className="toolbar">
							<If test={this.props.currentUser}>
								<a onClick={this.rerun} disabled={rerunDisabled} className="btn btn-default" href="">Rerun <span className="glyphicon glyphicon-refresh"></span></a>
							</If>

							<a className="btn btn-default" href={dockunitUrl}>Dockunit.json <span className="icon-logo"></span></a>
							<a className="btn btn-default" href={githubUrl}>Repo <span className="icomoon icomoon-github"></span></a>
							<a className={buildDetailsButtonsClasses} onClick={this.toggleBuildDetails}>
								Build Details 
								<If test={this.props.build.finished}>
									<span>
										<If test={this.state.showBuildDetails}>
											<span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
										</If>

										<If test={!this.state.showBuildDetails}>
											<span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
										</If>
									</span>
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
