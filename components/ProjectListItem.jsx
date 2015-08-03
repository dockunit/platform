'use strict';

import {NavLink} from 'fluxible-router';
import React from 'react';
import If from './If';
import _ from 'lodash';
import timeago from 'timeago';

class ProjectListItem extends React.Component {
	render() {
		let githubUrl = 'https://github.com/' + this.props.project.repository;
		let projectUrl = '/projects/' + this.props.project.repository;
		let repositoryUser = this.props.project.repository.replace(/^(.*?)\/.*/i, '$1');
		let repositoryName = this.props.project.repository.replace(/^.*?\/(.*)$/i, '$1');
		let dockunitUrl = githubUrl + '/blob/' + this.props.project.branch + '/Dockunit.json';
		let userUrl = '';

		let statusClasses = 'status glyphicon ';
		let latestBuild = false;

		for (let i = this.props.project.builds.length - 1; i >= 0; i--) {
			latestBuild = this.props.project.builds[i];

			if (this.props.project.branch === latestBuild.branch) {
				break;
			}
		}

		let commitUrl = githubUrl + '/commit/' + latestBuild.commit;

		if (!this.props.project.builds.length) {
			statusClasses += 'glyphicon-option-horizontal';
		} else {
			userUrl = 'https://github.com/' + latestBuild.commitUser;

			if (latestBuild) {
				if (latestBuild.finished) {
					if (255 === latestBuild.result) {
						statusClasses += 'glyphicon-exclamation-sign';
					} else if (0 < latestBuild.result) {
						statusClasses += 'glyphicon-remove';
					} else {
						statusClasses += 'glyphicon-ok';
					}
				} else {
					statusClasses += 'glyphicon-option-horizontal';
				}
			} else {
				statusClasses += 'glyphicon-remove';
			}
		}

		let shortCommit = (latestBuild && latestBuild.commit) ? latestBuild.commit.replace(/^([a-z0-9]{0,9}).*$/i, '$1') : '';

		return (
			<div className="project-item">
				<div className="main">
					<span className={statusClasses}></span>

					<div className="left">
						<h4><NavLink navParams={{username: repositoryUser, repository: repositoryName}} routeName="project">{this.props.project.repository}</NavLink></h4>

						<div className="item">
							Primary Project Branch: <strong>{this.props.project.branch}</strong>
						</div>
					</div>

					<div className="right">
						<If test={this.props.project.latestBuild}>
							<div className="item">Last ran <strong>{this.props.project.latestBuild && timeago(this.props.project.latestBuild.ran)}</strong></div>
						</If>
						<If test={!this.props.project.builds.length}>
							<div className="item"><strong>No builds have ran yet</strong></div>
						</If>


						<If test={this.props.project.builds.length}>
							<div className="item">
								Commit <a href={commitUrl}><strong>{latestBuild && shortCommit}</strong></a> by <a href={userUrl}><strong>{latestBuild && latestBuild.commitUser}</strong></a>
							</div>
						</If>

						<div className="toolbar">
							<a className="btn btn-default" href="">Rerun <span className="glyphicon glyphicon-refresh"></span></a>
							<a className="btn btn-default" href={dockunitUrl}>Dockunit.json <span className="icomoon icomoon-anchor"></span></a>
							<a className="btn btn-default" href={githubUrl}>Repo <span className="icomoon icomoon-github"></span></a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProjectListItem;
