'use strict';

module.exports = function(context, payload, done) {
	context.service.create('builds', payload, {}, function(error, response) {
		done();
	});
};