'use strict';

module.exports = function (context, payload, done) {
	context.service.read('builds', payload, {}, function (error, builds) {
		if (error) {
			context.dispatch('READ_BUILDS_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_BUILDS_SUCCESS', {builds: builds, repository: payload.repository});
		done();
	});
};