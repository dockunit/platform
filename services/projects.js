'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var Project = mongoose.model('Project');
var github = require('../clients/github');
var NPromise = require('promise');
var kue = require('kue');
var queue = kue.createQueue();

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

		var user = req.user;

		if (!user) {
			callback('Not logged in');
		}

		Project.find({ user: user._id }).sort('-created').exec(function(error, projects) {
			if (error) {
				debug('No projects found for ' + user._id);

				callback(error);
			} else {
				var projectObjects = {};
					
				projects.forEach(function(project) {
					projectObjects[project.repository] = project;
				});

				callback(null, projectObjects);
			}
		});
	},

	update: function (req, resource, params, body, config, callback) {
		
	}
};