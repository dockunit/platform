'use strict';

var loadPage = require('../actions/loadPage');
var UserStore = require('../stores/UserStore');
var _ = require('lodash');

module.exports = {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        action: loadPage
    },
	register: {
		path: '/register',
		method: 'get',
		page: 'register',
		title: 'Sign Up',
		type: 'explore',
		action: loadPage
	},
	login: {
		path: '/login',
		method: 'get',
		page: 'login',
		title: 'Login',
		action: function (actionContext, payload, done) {
			var user = actionContext.getStore(UserStore).getCurrentUser();

			if (user) {
				var navKey = 'home';

				payload.name = navKey;
				payload.url = module.exports[navKey].path;
				payload.config = module.exports[navKey];
				payload.redirectPath = '/';
			} else {
				payload.redirectPath = '/login';
			}

			loadPage(actionContext, payload, done);
		}
	},
	addProject: {
		path: '/projects/add',
		method: 'get',
		page: 'addProject',
		title: 'Add a Project',
		action: function (actionContext, payload, done) {
			var user = actionContext.getStore(UserStore).getCurrentUser(),
				navKey;

			if (!user) {
				navKey = 'login';

				payload.name = navKey;
				payload.url = module.exports[navKey].path;
				payload.config = module.exports[navKey];
				payload.redirectPath = '/projects/add';
			} else {
				if (!process.env.NODE_ENV || 'dev' !== process.env.NODE_ENV) {
					var githubAccessToken = user.githubAccessToken;

					if (!githubAccessToken) {
						navKey = 'githubAuthorize';

						payload.name = navKey;
						payload.url = module.exports[navKey].path;
						payload.config = module.exports[navKey];
						payload.redirectPath = '/projects/add';
					}
				}
			}

			loadPage(actionContext, payload, done);
		}
	},
	githubAuthorize: {
		path: '/projects/authorize',
		method: 'get',
		page: 'githubAuthorize',
		title: 'Authorize Github Account',
		params: {
			// RegExp broken?
			code: true,
			state: true
		},
		action: function (actionContext, payload, done) {
			var user = actionContext.getStore(UserStore).getCurrentUser(),
				navKey;

			if (!user) {
				navKey = 'login';

				payload.name = navKey;
				payload.url = module.exports[navKey].path;
				payload.config = module.exports[navKey];
				payload.redirectPath = '/login';
			} else {
				var githubAccessToken = user.githubAccessToken;

				if (githubAccessToken) {
					navKey = 'projects';

					payload.name = navKey;
					payload.url = module.exports[navKey].path;
					payload.config = module.exports[navKey];
					payload.redirectPath = '/projects';
				}
			}

			loadPage(actionContext, payload, done);
		}
	},
	about: {
		path: '/about',
		method: 'get',
		page: 'about',
		title: 'The Story',
		type: 'explore',
		action: loadPage
	},
	projects: {
		path: '/projects',
		method: 'get',
		page: 'projects',
		title: 'Projects',
		type: 'account',
		action: function (actionContext, payload, done) {
			var user = actionContext.getStore(UserStore).getCurrentUser(),
				navKey;

			if (!user) {
				navKey = 'login';

				payload.name = navKey;
				payload.url = module.exports[navKey].path;
				payload.config = module.exports[navKey];
				payload.redirectPath = '/projects';
			} else {
				if (!process.env.NODE_ENV || 'dev' !== process.env.NODE_ENV) {
					var githubAccessToken = user.githubAccessToken;

					if (!githubAccessToken) {
						navKey = 'githubAuthorize';

						payload.name = navKey;
						payload.url = module.exports[navKey].path;
						payload.config = module.exports[navKey];
						payload.redirectPath = '/projects/authorize';
					}
				}
			}

			loadPage(actionContext, payload, done);
		}
	},
	project: {
		path: '/projects/([^/]+)/(.*)',
		method: 'get',
		page: 'project',
		title: 'Project',
		action: function (actionContext, payload, done) {
			var user = actionContext.getStore(UserStore).getCurrentUser(),
				navKey;

			/*if (!user) {
				navKey = 'login';

				payload.name = navKey;
				payload.url = module.exports[navKey].path;
				payload.config = module.exports[navKey];
				payload.redirectPath = '/projects/' + payload.params[0] + '/' + payload.params[1];
			} else {*/
			payload.redirectPath = '/projects/' + payload.params[0] + '/' + payload.params[1];
			payload.config = _.extend({}, payload.config);
			payload.config.path = payload.redirectPath;
			//}

			loadPage(actionContext, payload, done);
		}
	}
};
