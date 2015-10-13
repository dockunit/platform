'use strict';

module.exports = function(context, payload, done) {
	context.dispatch('UPDATE_SHOW_HELP', payload);

	done();
};