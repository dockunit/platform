'use strict';

module.exports = function(context, payload, done) {
	payload.action = 'rerun';
	context.service.create('builds', payload, {}, function(error, response) {
		if (error) {
			context.dispatch('RERUN_BUILD_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('RERUN_BUILD_SUCCESS', payload);
		done();
	});
};