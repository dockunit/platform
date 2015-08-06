'use strict';

module.exports = function (context, payload, done) {
	payload.type = 'exists';

	context.service.read('users', payload, {}, function (error, response) {

		if (!response.exists) {
			context.dispatch('USER_EXISTS_FAILURE', response);
			done();
			return;
		}

		context.dispatch('USER_EXISTS_SUCCESS', response);
		done();
	});
};