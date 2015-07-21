'use strict';
var github = require('../clients/github');

module.exports = {
	name: 'github',

	read: function(req, resource, params, config, callback) {
		var user = req.user;

		if (!user || !user.githubAccessToken) {
			callback('Not Github authenticated/authorized');
			return;
		}

		if ('repositories' === params.type) {
			github.repos.get(req.user.githubAccessToken).then(function(repos) {
				callback(false, repos);
			}, function() {
				callback(true);
			});
		} else if ('branches' === params.type) {
			github.branches.get(req.user.githubAccessToken, params.repository).then(function(branches) {
				callback(false, branches);
			}, function() {
				callback(true);
			});
		}
	},

	create: function(req, resource, params, config, callback) {
		var user = req.user;

		if (!user || !user.githubAccessToken) {
			callback('Not Github authenticated/authorized');
		}

		if ('webhooks' === params.type) {
			github.webhooks.create(req.user.githubAccessToken, params.repository).then(function(response) {
				callback(false, response);
			}, function() {
				callback(true);
			});
		}
	}
};