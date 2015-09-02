'use strict';
var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var User = mongoose.model('User');
var constants = require('../constants');
var mailchimp = require('mailchimp-api');

module.exports = {
	name: 'users',
	create: function (req, resource, params, body, config, callback) {
		debug('Create user with ' + params);

		if (params.importantEmail) {
			debug('Honeypot caught something');
			callback(true);
			return;
		}

		var user = new User();

		user.firstName = params.firstName;
		user.lastName = params.lastName;
		user.email = params.email;
		user.password = params.password;
		user.username = params.username;

		user.save(function(error) {
			var mc = new mailchimp.Mailchimp(constants.mailchimpAPIKey);

			mc.lists.subscribe({ double_optin: false, id: constants.mailchimpListId, email: { email: user.email } }, function(data) {
				debug('User added to Mailchimp');
			},
			function(error) {
				debug('User failed to be added to Mailchimp');
			});

			callback(null, error);
		});
	},

	read: function(req, resource, params, config, callback) {
		if ('exists' === params.type) {
			debug('Check if user exists with ' + params);

			delete params.type;

			User.find(params, function(error, response) {
				if (! response.length) {
					params.exists = false;
					callback(false, params);
				} else {
					params.exists = true;
					callback(false, params);
				}

			});
		}
	},

	update: function (req, resource, params, body, config, callback) {
		//console.log('update user');
	}
};