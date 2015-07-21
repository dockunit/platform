/*global window: true */

'use strict';

var createStore = require('fluxible/addons').createStore;
var _ = require('lodash');

var UserStore = createStore({
	storeName: 'UserStore',

	handlers: {
		'CREATE_USER_FAILURE': 'createUserFailure',
		'CREATE_USER_SUCCESS': 'createUserSuccess',
		'UPDATE_CURRENT_USER': 'updateCurrentUser',
		'USER_EXISTS_SUCCESS': 'cacheUser',
		'USER_EXISTS_FAILURE': 'cacheUser',
		'UPDATE_LOGIN_FORM_STATUS': 'updateLoginFormStatus',
		'UPDATE_LOGIN_HEADER_STATUS': 'updateLoginHeaderStatus',
		'READ_GITHUB_REPOSITORIES_SUCCESS': 'updateCurrentUser',
		'READ_GITHUB_REPO_BRANCHES_SUCCESS': 'updateRepoBranches'
	},

	initialize: function () {
		this.currentUser = null;
		this.userCache = {};
		this.loginFormStatus = 0;
		this.loginHeadertatus = 0;
	},

	updateRepoBranches: function(branchObject) {
		this.currentUser = this.currentUser || {};

		if (this.currentUser.repositories && this.currentUser.repositories[branchObject.repository]) {
			this.currentUser.repositories[branchObject.repository].branches = branchObject.branches;
		}

		this.emitChange();
	},

	cacheUser: function(user) {
		this.userCache[user.username] = user.exists;
		this.emitChange();
	},

	updateLoginFormStatus: function(status) {
		this.loginFormStatus = status;
		this.emitChange();
	},

	updateLoginHeaderStatus: function(status) {
		this.loginHeaderStatus = status;
		this.emitChange();
	},

	createUserSuccess: function(newUser) {
		this.newRegistration = true;
		this.emitChange();
	},

	createUserFailure: function(failedUser) {
		//console.log('user failure');
	},

	updateCurrentUser: function(newUser) {
		// We don't want to save the password
		delete newUser.password;

		this.loginStatus = 0;

		this.currentUser = this.currentUser || {};
		_.assign(this.currentUser, newUser);

		this.emitChange();
	},

	getUserCache: function() {
		return this.userCache;
	},

	getCurrentUser: function() {
		return this.currentUser;
	},

	getLoginHeaderStatus: function() {
		return this.loginHeaderStatus;
	},

	getLoginFormStatus: function() {
		return this.loginFormStatus;
	},

	getState: function() {
		return {
			currentUser: this.currentUser,
			userCache: this.userCache,
			loginFormStatus: this.loginFormStatus,
			loginHeaderStatus: this.loginHeaderStatus
		};
	},

	dehydrate: function() {
		return this.getState();
	},
	rehydrate: function(state) {
		this.currentUser = state.currentUser;
		this.userCache = state.userCache;
		this.loginFormStatus = state.loginFormStatus;
		this.loginHeaderStatus = state.loginHeaderStatus;
	}
});

module.exports = UserStore;