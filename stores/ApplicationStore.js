'use strict';
var createStore = require('fluxible/addons').createStore;
var routesConfig = require('../configs/routes');

var ApplicationStore = createStore({
    storeName: 'ApplicationStore',
    handlers: {
		'CHANGE_ROUTE_SUCCESS': 'handleNavigate',
		'UPDATE_CSRF_TOKEN': 'setCsrfToken'
    },

    initialize: function() {
        this.currentPageName = null;
        this.currentPage = null;
        this.currentRoute = null;
        this.pages = routesConfig;
		this.csrf = '';
        this.pageTitle = '';
		this.csrfToken = null;
		this.redirectPath = null;
    },

    handleProjectCreate: function() {

    },

    handleNavigate: function(route) {
        if (this.currentRoute && (this.currentRoute.url === route.url)) {
            return;
        }

		var pageName = route.config.page;
		var pageTitle = 'Dockunit » ' + route.config.title;
        var page = this.pages[pageName];

		this.currentPageName = pageName;
		this.pageTitle = pageTitle;
        this.currentPage = page;
        this.currentRoute = route;
        this.redirectPath = route.redirectPath;
        this.emitChange();
    },

	setCsrfToken: function(token) {
		this.csrfToken = token;
	},

	getCsrfToken: function() {
		return this.csrfToken;
	},

	getRedirectPath: function() {
		return this.redirectPath;
	},

    getCurrentPageName: function() {
        return this.currentPageName;
    },

    getPageTitle: function() {
        return this.pageTitle;
    },
    getCurrentRoute: function() {
        return this.currentRoute;
    },

    getPages: function() {
        return this.pages;
    },

    dehydrate: function() {
        return {
            currentPageName: this.currentPageName,
            currentPage: this.currentPage,
            pages: this.pages,
            route: this.currentRoute,
            pageTitle: this.pageTitle,
			csrfToken: this.csrfToken,
			redirectPath: this.redirectPath
        };
    },

    rehydrate: function (state) {
        this.currentPageName = state.currentPageName;
        this.currentPage = state.currentPage;
        this.pages = state.pages;
        this.currentRoute = state.route;
        this.pageTitle = state.pageTitle;
		this.csrfToken = state.csrfToken;
		this.redirectPath = state.redirectPath;
    }
});

module.exports = ApplicationStore;
