'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var kue = require('kue');
var queue = kue.createQueue();
var Github = require('../clients/Github');
var Project = mongoose.model('Project');

module.exports = {
	name: 'builds',

	create: function(req, resource, params, body, config, callback) {
		debug('Create a new build');

		var user = req.user;

		if (!user) {
			callback('Not logged in');
			return;
		}

		params.user = user;

		Project.find({ repository: params.repository }, function(error, projects) {
			if (error || !projects.length) {
				debug('Could not find project');
				callback(true);
			} else {
				var project = projects[0];
				var socket = require('socket.io-client')('http://localhost:3000');

				var build = {};

				if ('rerun' === params.action) {
					debug('Reruning build');
					build = project.builds.id(params.buildId);

					if (!build) {
						debug('Could not find build');
						callback(true);
						return;
					}

					build.output = '';
					build.result = 0;
					build.finished = null;
					build.ran = null;
					build.outputCode = null;

					project.save(function(error) {
						if (error) {
							debug('Project save error: ' + error);
							callback(true);
						} else {
							debug('Emitting new build to ' + user.username);

							Github.statuses.create(user.githubAccessToken, params.repository, user.username, build.commit, 'pending');

							socket.emit('rerunBuild', { build: build, user: user.username, repository: params.repository });

							queue.create('builder', {user: user, repository: params.repository, buildId: params.buildId}).save(function(error) {
								if (error) {
									callback(true);
								} else {
									callback(null);
								}
							});
						}
					});

				} else {
					debug('Creating a fresh build');
					Github.branch.get(user.githubAccessToken, params.repository, params.branch).then(function(response) {

						build.commit = response.commit.sha;
						build.branch = params.branch;
						build.output = '';
						build.ran = null;
						build.commitUser = response.commit.committer.login;
						build = project.builds.create(build);

						project.builds.push(build);

						project.save(function(error) {
							if (error) {
								debug('Project save error: ' + error);
								callback(true);
							} else {
								debug('Emitting new build to ' + user.username);

								Github.statuses.create(user.githubAccessToken, params.repository, user.username, build.commit, 'pending');

								socket.emit('newBuild', { build: build, user: user.username, repository: params.repository });

								queue.create('builder', {user: user, repository: params.repository, buildId: build._id}).save(function(error) {
									if (error) {
										callback(true);
									} else {
										Github.webhooks.create(user.githubAccessToken, params.repository).then(function() {
											callback(null);
										}, function() {
											callback(true);
										});
									}
								});
							}
						});
					});
				}
			}
		});
	}
};