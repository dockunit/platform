'use strict';

module.exports = function (context, payload, done) {
	context.service.read('projects', payload, {}, function (error, projects) {
		if (error) {
			context.dispatch('READ_MY_PROJECTS_FAILURE', payload);
			done();
			return;
		}
		if (window && io) {
			var socket = io();

			for (var project in projects) {
				socket.emit('join', { repository: project } );
			}
		}

		context.dispatch('READ_MY_PROJECTS_SUCCESS', projects);
		done();
	});
};