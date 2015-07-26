'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var Project = mongoose.model('Project');
var github = require('../clients/github');
var NPromise = require('promise');
var kue = require('kue');
var queue = kue.createQueue();
var github = require('../clients/github');

module.exports = {
	name: 'projects',
	create: function (req, resource, params, body, config, callback) {
		debug('Create project with ' + params);

		var user = req.user;

		if (!user) {
			callback('Not logged in');
			return;
		}

		if (!user.githubAccessToken) {
			callback('Not Github authenticated/authorized');
			return;
		}

		var project = new Project();
		
		project.repository = params.repository;
		project.branch = params.branch;
		project.private = params.private;
		project.user = user._id;

		project.save(function(error) {
			github.webhooks.create(user.githubAccessToken, params.repository).then(function() {
				callback(null, { project: project, user: user.username });
			}, function() {
				callback(true);
			});
		});
	},

	read: function(req, resource, params, config, callback) {
		debug('Read projects');

		var query = {};
		var projectObjects = {};
		var user = req.user || false;

		if (params.mine) {
			// Get all my projects

			if (!user) {
				callback('Not logged in');
				return;
			}

			query.user = user._id;

			Project.find(query).sort('-created').exec(function(error, projects) {
				if (error) {
					debug('No projects found for ' + user._id);

					callback(error);
				} else {
					projects.forEach(function(project) {
						project.mine = true;

						projectObjects[project.repository] = project;
					});

					callback(null, projectObjects);
				}
			});

		} else if (!params.mine && params.repository) {
			// Get a specific project

			query.repository = params.repository;
			
			Project.find(query).exec(function(error, projects) {
				if (error || !projects.length) {
					debug('Project not found');

					callback(error);
				} else {
					var project = projects[0];
					project.mine = false;

					if (user && user.githubAccessToken) {
						if (String(user._id) === String(project.user)) {
							project.mine = true;
							projectObjects[project.repository] = project;

							callback(null, projectObjects);
						} else {
							if (project.private) {
								/**
								 * Logged in but this is not our project and it's private
								 * we need to see if our Github account has perms
								 */

								github.repos.get(user.githubAccessToken).then(function(repos) {
									if (repos[params.repository]) {
										projectObjects[project.repository] = project;

										callback(null, projectObjects);
									}
								}, function() {
									debug('Could not retrieve repos to verify access for private project');
									callback(true);
								});
							} else {
								callback(null, projectObjects);
							}
						}
					} else {
						if (project.private) {
							// No access!
						} else {
							projectObjects[project.repository] = project;
						}

						callback(null, projectObjects);
					}
				}
			});
		}
	},

	update: function (req, resource, params, body, config, callback) {
		
	}
};