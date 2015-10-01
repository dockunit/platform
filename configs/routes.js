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
        handler: require('../components/Home'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - A Containered Continuous Integration Service' });
            done();
        }
    },
	register: {
		path: '/register',
		method: 'get',
		page: 'register',
		type: 'explore',
		title: 'Register',
		handler: require('../components/Register'),
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Create an Account' });
            done();
        }
	},
	blog: {
		path: '/blog',
		method: 'get',
		page: 'blog',
		//type: 'explore',
		title: 'Blog',
		handler: require('../components/Blog'),
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Blog' });
            done();
        }
	},
	login: {
		path: '/login',
		method: 'get',
		page: 'login',
		title: 'Login',
		handler: require('../components/Login'),
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Login' });
            done();
        }
	},
	addProject: {
		path: '/projects/add',
		method: 'get',
		page: 'addProject',
		title: 'Add a Project',
		handler: require('../components/AddProject'),
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Create a Project' });
            done();
        }
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
		},
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Authorize Your Github Account' });
            done();
        }
	},
	about: {
		path: '/about',
		method: 'get',
		page: 'about',
		title: 'About',
		handler: require('../components/About'),
		type: 'explore',
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - The Story' });
            done();
        }
	},
	projects: {
		path: '/projects',
		method: 'get',
		page: 'projects',
		title: 'Projects',
		handler: require('../components/Projects'),
		type: 'account',
		action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - Projects' });
            done();
        }
	},
	project: {
		path: '/projects/:username/:repository',
		method: 'get',
		handler: require('../components/Project'),
		page: 'project',
		action: (context, payload, done) => {
			let params = payload.get('params');

            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Dockunit.io - ' + params.get('username') + '/' + params.get('repository') });
            done();
        }
	}
};
