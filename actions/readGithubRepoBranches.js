'use strict';

module.exports = function(context, payload, done) {
	payload.type = 'branches';

	context.service.read('github', payload, {}, function(error, branches) {
		if (error) {
			context.dispatch('READ_GITHUB_REPO_BRANCHES_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_GITHUB_REPO_BRANCHES_SUCCESS', { repository: payload.repository, branches: branches });
		done();
	});

};
