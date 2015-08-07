'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var kue = require('kue');
var queue = kue.createQueue();
var Github = require('../clients/Github');

module.exports = {
	name: 'builds',

	create: function(req, resource, params, config, callback) {
		debug('Create a new build');

		var user = req.user;

		if (!user) {
			callback('Not logged in');
			return;
		}

		// Todo: check to make sure project belongs to user

		Github.branch.get(user.githubAccessToken, params.repository, params.branch).then(function(response) {
			params.commit = response.commit.sha;
			params.commitUser = response.commit.committer.login;
			params.user = user;

			queue.create('builder', params).save(function(error){
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
		}, function() {
			callback(true);
		});
	}
};