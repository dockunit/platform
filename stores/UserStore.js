/*global window: true */

'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';
import _ from 'lodash';

class UserStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);

		this.currentUser = null;
		this.userCache = {};
		this.loginFormStatus = 0;
		this.loginHeadertatus = 0;
	}

	updateRepoBranches(branchObject) {
		this.currentUser = this.currentUser || {};

		if (this.currentUser.repositories && this.currentUser.repositories[branchObject.repository]) {
			this.currentUser.repositories[branchObject.repository].branches = branchObject.branches;
		}

		this.emitChange();
	}

	cacheUser(user) {
		this.userCache[user.username] = user.exists;
		this.emitChange();
	}

	updateLoginFormStatus(status) {
		this.loginFormStatus = status;
		this.emitChange();
	}

	updateLoginHeaderStatus(status) {
		this.loginHeaderStatus = status;
		this.emitChange();
	}

	createUserSuccess(newUser) {
		this.newRegistration = true;
		this.emitChange();
	}

	createUserFailure(failedUser) {
		//console.log('user failure');
	}

	updateCurrentUser(newUser) {
		// We don't want to save the password
		delete newUser.password;

		this.loginStatus = 0;

		this.currentUser = this.currentUser || {};
		_.assign(this.currentUser, newUser);

		this.emitChange();
	}

	getState() {
		return {
			currentUser: this.currentUser,
			userCache: this.userCache,
			loginFormStatus: this.loginFormStatus,
			loginHeaderStatus: this.loginHeaderStatus
		};
	}

	dehydrate() {
		return this.getState();
	}

	rehydrate(state) {
		this.currentUser = state.currentUser;
		this.userCache = state.userCache;
		this.loginFormStatus = state.loginFormStatus;
		this.loginHeaderStatus = state.loginHeaderStatus;
	}
}

UserStore.storeName = 'UserStore';

UserStore.handlers = {
	'CREATE_USER_FAILURE': 'createUserFailure',
	'CREATE_USER_SUCCESS': 'createUserSuccess',
	'UPDATE_CURRENT_USER': 'updateCurrentUser',
	'USER_EXISTS_SUCCESS': 'cacheUser',
	'USER_EXISTS_FAILURE': 'cacheUser',
	'UPDATE_LOGIN_FORM_STATUS': 'updateLoginFormStatus',
	'UPDATE_LOGIN_HEADER_STATUS': 'updateLoginHeaderStatus',
	'READ_GITHUB_REPOSITORIES_SUCCESS': 'updateCurrentUser',
	'READ_GITHUB_REPO_BRANCHES_SUCCESS': 'updateRepoBranches'
};

export default UserStore;