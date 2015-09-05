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

		navigate(context, {
	        url: '/projects/' + payload.repository
	    }, function() {
	    	/*context.service.create('builds', response, {}, function() {
				done();
			});*/
	    });
	});
};