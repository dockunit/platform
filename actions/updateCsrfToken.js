'use strict';
module.exports = function(context, payload, done) {
	context.dispatch('UPDATE_CSRF_TOKEN', payload);

	done();
};