'use strict';

module.exports = function(context, payload, done) {
	payload.type = 'webhooks';

	context.service.create('github', payload, {}, function(error, response) {
		if (error) {
			context.dispatch('CREATE_GITHUB_WEBHOOK_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('CREATE_GITHUB_WEBHOOK_SUCCESS', { repository: payload.repository, response: response });
		done();
	});

};
