'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var kue = require('kue');
var queue = kue.createQueue();
var Build = mongoose.model('Build');
var Github = require('../clients/Github');
var Project = mongoose.model('Project');

module.exports = {
	name: 'builds',

	create: function(req, resource, params, body, config, callback) {
		debug('Create a new build');

		var user = req.user,
			build;

		if (!user) {
			callback('Not logged in');
			return;
		}
		
		var socket = require('socket.io-client')('http://localhost:3000');

		if ('rerun' === params.action) {
			debug('Reruning build');

			Build.find({ _id: params.buildId }, function(error, builds) {
				if (error || !builds.length) {
					debug('Could not find build');
					callback(true);
				} else {
					build = builds[0];

					build.output = '';
					build.result = 0;
					build.finished = null;
					build.started = null;
					build.outputCode = null;

					build.save(function(error) {
						if (error) {
							debug('Build save error: ' + error);
							callback(true);
						} else {
							debug('Emitting new build to ' + user.username);

							Github.statuses.create(user.githubAccessToken, params.project.repository, user.username, build.commit, 'pending', build.branch);

							socket.emit('rerunBuild', { build: build, user: user.username, repository: params.project.repository });

							queue.create('builder', {user: user, project: params.project, repository: params.project.repository, buildId: params.buildId}).save(function(error) {
								if (error) {
									callback(true);
								} else {
									callback(null);
								}
							});
						}
					});
				}
			});

		} else {
			debug('Creating a fresh build');

			Github.branch.get(user.githubAccessToken, params.project.repository, params.branch).then(function(response) {

				build = new Build();

				build.commit = response.commit.sha;
				build.branch = params.branch;
				build.output = '';
				build.project = params.project._id;
				build.commitUser = response.commit.committer.login;

				build.save(function(error) {
					if (error) {
						debug('Build save error: ' + error);
						callback(true);
					} else {
						debug('Emitting new build to ' + user.username);

						Github.statuses.create(user.githubAccessToken, params.project.repository, user.username, build.commit, 'pending', params.branch);

						socket.emit('newBuild', { build: build, user: user.username, repository: params.project.repository });

						queue.create('builder', {user: user, project: params.project, repository: params.project.repository, buildId: build._id}).save(function(error) {
							if (error) {
								callback(true);
							} else {
								Github.webhooks.create(user.githubAccessToken, params.project.repository).then(function() {
									callback(null);
								}, function() {
									callback(true);
								});
							}
						});
					}
				});
			}, function() {
				debug('Could not find project branch to build');
			});
		}
	}
};