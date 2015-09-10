'use strict';
var _ = require('lodash');

module.exports = function (context, payload, done) {
	context.service.read('projects', { hot: true }, {}, function (error, projects) {
		if (error || !projects.length) {
			context.dispatch('READ_HOT_PROJECTS_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_HOT_PROJECTS_SUCCESS', projects);
		done();
	});
};