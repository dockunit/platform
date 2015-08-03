'use strict';

import loadPage from '../actions/loadPage';
import UserStore from '../stores/UserStore';
import _ from 'lodash';

export default {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        handler: require('../components/Home')
    },
	register: {
		path: '/register',
		method: 'get',
		page: 'register',
		type: 'explore',
		title: 'Register',
		handler: require('../components/Register')
	},
	login: {
		path: '/login',
		method: 'get',
		page: 'login',
		title: 'Login',
		handler: require('../components/Login')
	},
	addProject: {
		path: '/projects/add',
		method: 'get',
		page: 'addProject',
		title: 'Add a Project',
		handler: require('../components/AddProject'),
	},
	githubAuthorize: {
		path: '/projects/authorize',
		handler: require('../components/GithubAuthorize'),
		method: 'get',
		title: 'Authorize Your Github Account',
		page: 'githubAuthorize',
		params: {
			// RegExp broken?
			code: true,
			state: true
		}
	},
	about: {
		path: '/about',
		method: 'get',
		page: 'about',
		title: 'About',
		handler: require('../components/About'),
		type: 'explore'
	},
	projects: {
		path: '/projects',
		method: 'get',
		page: 'projects',
		title: 'Projects',
		handler: require('../components/Projects'),
		type: 'account'
	},
	project: {
		path: '/projects/:username/:repository',
		method: 'get',
		handler: require('../components/Project'),
		page: 'project',
	}
};
