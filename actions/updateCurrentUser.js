'use strict';

module.exports = function(context, payload, done) {
	context.dispatch('UPDATE_CURRENT_USER', payload);

	done();
};
