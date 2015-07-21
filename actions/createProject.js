'use strict';

var navigate = require('flux-router-component').navigateAction;

module.exports = function(context, payload, done) {
	context.service.create('projects', payload, {}, function(error, response) {
		if (error) {
			context.dispatch('CREATE_PROJECT_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('CREATE_PROJECT_SUCCESS', response.project);

		navigate(context, {
	        url: '/projects/' + response.user + '/' + payload.repository.replace(/^.*?\/(.*)$/, '$1')
	    }, function() {
	    	context.service.create('builds', payload, {}, function() {
				done();
			});
	    });
	});
};