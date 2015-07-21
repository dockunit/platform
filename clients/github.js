'use strict';
var NPromise = require('promise');
var httpInvoke = require('httpinvoke');
var debug = require('debug')('dockunit');
var constants = require('../constants');
var querystring = require('querystring');
var constants = require('../constants');

var repos = {
	get: function(token) {
		return new NPromise(function (fulfill, reject) {

			debug('Get github repos');

			httpInvoke('https://api.github.com/user/repos?access_token=' + token, 'GET', {
				headers: {
					'User-Agent': 'Dockunit'
				}
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to get Github repos: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					var repos = {};
					for (var i = 0; i < bodyObject.length; i++) {
						if (bodyObject[i].permissions.admin) {
							repos[bodyObject[i].full_name] = bodyObject[i];
							repos[bodyObject[i].full_name].branches = [];
						}
					}

					fulfill(repos);
				}
			});
		});
	}
};

var webhooks = {
	get: function(token, repository) {
		return new NPromise(function (fulfill, reject) {

			debug('Get github repo hooks for ' + repository);

			httpInvoke('https://api.github.com/repos/' + repository + '/hooks?access_token=' + token, 'GET', {
				headers: {
					'User-Agent': 'Dockunit'
				}
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to get Github repo hooks: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					fulfill(bodyObject);
				}
			});
		});
	},

	create: function(token, repository) {
		return new NPromise(function (fulfill, reject) {

			debug('Create github repo hook for ' + repository);

			var params = {
				name: 'web',
				active: true,
				events: [
					'push'
				],
				config: {
					url: 'http://dockunit.io/webhooks',
					content_type: 'json',
					secret: require('../constants').githubWebhooksSecret
				}
			};

			httpInvoke('https://api.github.com/repos/' + repository + '/hooks?access_token=' + token, 'POST', {
				headers: {
					'User-Agent': 'Dockunit',
					'Content-Type': 'application/json'
				},
				input: JSON.stringify(params)
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to create Github repo hook: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					fulfill(bodyObject);
				}
			});
		});
	}
};

var branches = {
	get: function(token, repository) {
		return new NPromise(function (fulfill, reject) {

			debug('Get github branches');

			httpInvoke('https://api.github.com/repos/' + repository + '/branches?access_token=' + token, 'GET', {
				headers: {
					'User-Agent': 'Dockunit'
				}
			}, function(error, body, statusCode, headers) {

				if (error) {
					debug('Failed to get Github repository branches: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					var branchesObject = {};

					for (var i = 0; i < bodyObject.length; i++) {
						branchesObject[bodyObject[i].name] = bodyObject[i];
					}

					fulfill(branchesObject);
				}
			});
		});
	}
};

var branch = {
	get: function(token, repository, branch) {
		return new NPromise(function (fulfill, reject) {

			debug('Get github branch');

			httpInvoke('https://api.github.com/repos/' + repository + '/branches/' + branch + '?access_token=' + token, 'GET', {
				headers: {
					'User-Agent': 'Dockunit'
				}
			}, function(error, body, statusCode, headers) {

				if (error) {
					debug('Failed to get Github repository branch: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					fulfill(bodyObject);
				}
			});
		});
	}
};

var tokens = {
	create: function(code, username) {
		return new NPromise(function (fulfill, reject) {
			var params = {
				code: code
			};

			params.client_id = constants.githubClientId;
			params.client_secret = constants.githubClientSecret;
			params.redirect_uri = 'http://dockunit.io/projects/authorize';

			debug('Get github access token with ' + params);

			httpInvoke('https://github.com/login/oauth/access_token', 'POST', {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				input: querystring.stringify(params)
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to POST to Github: ' + error);
					reject(error);
				} else {
					var bodyObject = querystring.parse(body);

					fulfill(bodyObject.access_token);
				}
			});
		});
	},

	getUser: function(token) {
		return new NPromise(function (fulfill, reject) {

			debug('Get github user from token ' + token);

			httpInvoke('https://api.github.com/user?access_token=' + token, 'GET', {
				headers: {
					'User-Agent': 'Dockunit'
				}
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to get github user: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					fulfill(bodyObject.login);
				}
			});
		});
	}
};

var statuses = {
	create: function(token, repository, user, commit, status) {
		return new NPromise(function (fulfill, reject) {

			debug('Create github status');

			var description = '';
			if ('success' === status) {
				description = 'Your Dockunit build succeeded.';
			} else if ('pending' === status) {
				description = 'Your Dockunit build pending.';
			} else if ('failure' === status) {
				description = 'Your Dockunit build failed.';
			} else if ('error' === status) {
				description = 'Your Dockunit build errored.';
			}

			var params = {
				state: status,
				target_url: constants.baseUrl + '/projects/' + user + '/' + repository.replace(/^.*?\/(.*)$/i, '$1'),
				description: description,
				context: 'continuous-integration/dockunit'
			};

			httpInvoke('https://api.github.com/repos/' + repository + '/statuses/' + commit + '?access_token=' + token, 'POST', {
				headers: {
					'User-Agent': 'Dockunit',
					'Content-Type': 'application/json'
				},
				input: JSON.stringify(params)
			}, function(error, body, statusCode, headers) {
				if (error) {
					debug('Failed to create Github status: ' + error);
					reject(error);
				} else {
					var bodyObject = JSON.parse(body);

					fulfill(bodyObject);
				}
			});
		});
	}
};

module.exports = {
	tokens: tokens,
	repos: repos,
	branches: branches,
	branch: branch,
	webhooks: webhooks,
	statuses: statuses
};