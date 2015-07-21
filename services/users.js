'use strict';
var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var User = mongoose.model('User');

module.exports = {
	name: 'users',
	create: function (req, resource, params, body, config, callback) {
		debug('Create user with ' + params);

		var user = new User();

		user.firstName = params.firstName;
		user.lastName = params.lastName;
		user.email = params.email;
		user.password = params.password;
		user.username = params.username;

		user.save(function(error) {
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