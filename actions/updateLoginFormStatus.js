'use strict';

module.exports = function(context, errorNum, done) {
	context.dispatch('UPDATE_LOGIN_FORM_STATUS', errorNum);

	done();
};
