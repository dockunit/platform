/*global window, io */

'use strict';

var navigate = require('fluxible-router').navigateAction;

module.exports = function(context, payload, done) {
	context.service.create('projects', payload, {}, function(error, response) {
		if (error) {
			context.dispatch('CREATE_PROJECT_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('CREATE_PROJECT_SUCCESS', response);

		if ('undefined' !== typeof window && 'undefined' !== typeof io) {
			var socket = io();
			socket.emit('join', { repository: payload.repository } );
		}

		response.branch = payload.branch;
    	context.service.create('builds', response, {}, function() {
			navigate(context, {
		        url: '/projects/' + payload.repository
		    }, function() {
		    	done();
		    });
		});
	});
};