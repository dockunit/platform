'use strict';

module.exports = function (context, payload, done) {
	context.service.read('projects', payload, {}, function (error, projects) {
		if (error) {
			context.dispatch('READ_PROJECTS_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_PROJECTS_SUCCESS', projects);
		done();
	});
};