'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.currentPageName = null;
        this.currentPage = null;
        this.currentRoute = null;
        this.pages = routesConfig;
        this.pageTitle = '';
        this.csrfToken = null;
        this.redirectPath = null;
    }

    handleNavigate(route) {
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
    }

    setCsrfToken(token) {
        this.csrfToken = token;
        this.emitChange();
    }

    getState() {
        return {
            currentPageName: this.currentPageName,
            currentPage: this.currentPage,
            pages: this.pages,
            currentRoute: this.currentRoute,
            pageTitle: this.pageTitle,
            csrfToken: this.csrfToken,
            redirectPath: this.redirectPath
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.currentPageName = state.currentPageName;
        this.currentPage = state.currentPage;
        this.pages = state.pages;
        this.currentRoute = state.currentRoute;
        this.pageTitle = state.pageTitle;
        this.csrfToken = state.csrfToken;
        this.redirectPath = state.redirectPath;
    }
}

ApplicationStore.storeName = 'ApplicationStore';

ApplicationStore.handlers = {
    'CHANGE_ROUTE': 'handleNavigate',
    'UPDATE_CSRF_TOKEN': 'setCsrfToken'
};

export default ApplicationStore;

