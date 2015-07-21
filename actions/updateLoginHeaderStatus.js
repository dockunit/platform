'use strict';

module.exports = function(context, errorNum, done) {
	context.dispatch('UPDATE_LOGIN_HEADER_STATUS', errorNum);

	done();
};
