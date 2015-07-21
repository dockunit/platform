'use strict';

module.exports = function (context, payload, done) {
	context.service.create('users', payload, {}, function (error, user) {
		if (error) {
			context.dispatch('CREATE_USER_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('CREATE_USER_SUCCESS', user);
		done();
	});
};