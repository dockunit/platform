'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var Project = mongoose.model('Project');
var Build = mongoose.model('Build');
var NPromise = require('promise');
var kue = require('kue');
var queue = kue.createQueue();
var Github = require('../clients/Github');
var reversePopulate = require('mongoose-reverse-populate');

module.exports = {
	name: 'projects',

	delete: function(req, resource, params, config, callback) {
		debug('Delete project ' + params.project.repository);

		let user = req.user;

		if (!user) {
			callback('Not logged in');
			return;
		}

		if (!params.project) {
			callback('No project provided');
			return;
		}

		Project.findOneAndRemove({ _id: params.project._id }, function(error) {
			if (error) {
				debug('Project could not be deleted');

				callback(error);
			} else {
				debug('Project ' + params.project.repository + ' successfully deleted');

				callback(null, { repository: params.project.repository });
			}
		});
	},

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
		project.private = params.privateRepository;
		project.user = user._id;

		project.save(function(error) {
			Github.webhooks.create(user.githubAccessToken, params.repository).then(function() {
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
			debug('Getting my projects');

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
					for (var i = 0; i < projects.length; i++) {
						projects[i].builds = [];
					}

					var reversePopulateOptions = {
						modelArray: projects,
						storeWhere: 'builds',
						arrayPop: true,
						mongooseModel: Build,
						idField: 'project'
					}, projectToSave;

					reversePopulate(reversePopulateOptions, function(error) {
						if (error) {
							debug('Error occured whene reverse populating builds');
						}

						projects.forEach(function(project) {
							projectToSave = project.toObject();
							projectToSave.builds = project.builds; // Weird hack.
							projectToSave.mine = true;

							projectObjects[project.repository] = projectToSave;
						});

						callback(null, projectObjects);
					});
				}
			});

		} else if (!params.mine && params.repository) {
			// Get a specific project
			debug('Getting a single project');

			query.repository = params.repository;
			
			Project.find(query).exec(function(error, projects) {
				if (error || !projects.length) {
					debug('Project not found');

					callback(error);
				} else {
					for (var i = 0; i < projects.length; i++) {
						projects[i].builds = [];
					}

					var reversePopulateOptions = {
						modelArray: projects,
						storeWhere: 'builds',
						arrayPop: true,
						mongooseModel: Build,
						idField: 'project'
					};

					reversePopulate(reversePopulateOptions, function(error) {
						var project = projects[0].toObject();
						project.builds = projects[0].builds; // Weird hack.
						project.mine = false;

						debug('Found one project');

						if (user && user.githubAccessToken) {
							if (String(user._id) === String(project.user)) {
								project.mine = true;
								projectObjects[project.repository] = project;

								debug('Returning a project that I own');

								callback(null, projectObjects);
							} else {
								if (project.private) {
									/**
									 * Logged in but this is not our project and it's private
									 * we need to see if our Github account has perms
									 */

									Github.repos.get(user.githubAccessToken).then(function(repos) {
										if (repos[params.repository]) {
											projectObjects[project.repository] = project;

											debug('Returning a project that isn\'t mine but I have access to');

											callback(null, projectObjects);
										} else {
											debug('Returning no project since I don\'t have access');

											callback(null, projectObjects);
										}
									}, function() {
										debug('Could not retrieve repos to verify access for private project');
										callback(null, projectObjects);
									});
								} else {
									debug('Return a non private project that isnt mine');
									projectObjects[project.repository] = project;

									callback(null, projectObjects);
								}
							}
						} else {
							if (project.private) {
								// No access!
								debug('Returning no project since it\'s private and I\'m not logged in');
							} else {
								debug('Returning a project since it\'s public and I\'m not logged in');
								projectObjects[project.repository] = project;
							}

							callback(null, projectObjects);
						}
					});
				}
			});
		}
	},

	update: function (req, resource, params, body, config, callback) {
		debug('Update project');

		let query = {};
		let user = req.user;

		if (!user) {
			callback('Not logged in');
			return;
		}

		query.user = user._id;
		query.repository = params.repository;

		Project.findOne(query, function(error, project) {
			if (error || !project) {
				debug('Project not found');

				callback(error);
			} else {
				if (project.branch !== params.branch) {
					project.branch = params.branch;

					project.save(function(error) {
						if (error) {
							debug('Could not save project');

							callback(error);
						} else {

							callback(null, project);
						}
					});
				} else {
					callback(null, project);
				}
			}
		});
	}
};