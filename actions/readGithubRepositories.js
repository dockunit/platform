'use strict';

module.exports = function getGithubRepositories(context, payload, done) {
	payload.type = 'repositories';

	context.service.read('github', payload, {}, function(error, repos) {
		if (error) {
			context.dispatch('READ_GITHUB_REPOSITORIES_FAILURE', payload);
			done();
			return;
		}

		context.dispatch('READ_GITHUB_REPOSITORIES_SUCCESS', { repositories: repos });
		done();
	});

};
