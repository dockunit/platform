'use strict';

var React = require('react');
var If = require('./If');
var NavLink = require('flux-router-component').NavLink;
var timeago = require('timeago');
var _ = require('lodash');

var ProjectListItem = React.createClass({
	render: function() {
		var githubUrl = 'https://github.com/' + this.props.project.repository;
		var projectUrl = '/projects/' + this.props.project.repository;
		var repositoryUser = this.props.project.repository.replace(/^(.*?)\/.*/i, '$1');
		var repositoryName = this.props.project.repository.replace(/^.*?\/(.*)$/i, '$1');
		var dockunitUrl = githubUrl + '/blob/' + this.props.project.branch + '/Dockunit.json';
		var userUrl = '';

		var statusClasses = 'status glyphicon ';
		var latestBuild = false;

		for (var i = this.props.project.builds.length - 1; i >= 0; i--) {
			latestBuild = this.props.project.builds[i];

			if (this.props.project.branch === latestBuild.branch) {
				break;
			}
		}

		var commitUrl = githubUrl + '/commit/' + latestBuild.commit;

		if (!this.props.project.builds.length) {
			statusClasses += 'glyphicon-option-horizontal';
		} else {
			userUrl = 'https://github.com/' + latestBuild.commitUser;

			if (latestBuild) {
				if (latestBuild.finished) {
					if (0 < latestBuild.result) {
						statusClasses += 'glyphicon-remove';
					} else if (-500 === latestBuild.result) {
						statusClasses += 'glyphicon-exclamation-sign';
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

		var shortCommit = (latestBuild && latestBuild.commit) ? latestBuild.commit.replace(/^([a-z0-9]{0,9}).*$/i, '$1') : '';

		return (
			<div className="project-item">
				<div className="main">
					<span className={statusClasses}></span>

					<div className="left">
						<h4><NavLink navParams={[repositoryUser, repositoryName]} routeName="project">{this.props.project.repository}</NavLink></h4>

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
});

module.exports = ProjectListItem;
