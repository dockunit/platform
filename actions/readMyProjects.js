/*global window, io */

'use strict';

import updateShowHelp from './updateShowHelp';

module.exports = function (context, payload, done) {
	context.service.read('projects', payload, {}, function (error, projects) {
		if (error) {
			context.dispatch('READ_MY_PROJECTS_FAILURE', payload);
			done();
			return;
		}
		if ('undefined' !== typeof window && 'undefined' !== typeof  io) {
			var socket = io();

			for (var project in projects) {
				socket.emit('join', { repository: project } );
			}
		}

		if (!projects || Object.keys(projects).length < 1) {
			context.executeAction(updateShowHelp, true);
		}

		context.dispatch('READ_MY_PROJECTS_SUCCESS', projects);
		done();
	});
};