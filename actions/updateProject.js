'use strict';

module.exports = function(context, payload, done) {
	context.service.update('projects', payload, {}, function(error, project) {
		if (error) {
			context.dispatch('UPDATE_PROJECT_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('UPDATE_PROJECT_SUCCESS', project);

		done();
	});
};