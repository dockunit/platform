'use strict';

module.exports = function (context, payload, done) {
	context.service.read('projects', payload, {}, function (error, project) {
		if (error) {
			context.dispatch('READ_PROJECT_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_PROJECT_SUCCESS', project);
		done();
	});
};