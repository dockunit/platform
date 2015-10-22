'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        
        this.csrfToken = null;
        this.pageTitle = '';
        this.showHelp = false;
        this.showDockunitSetup = false;
    }

    setCsrfToken(token) {
        this.csrfToken = token;
        this.emitChange();
    }

    updatePageTitle(payload) {
        this.pageTitle = payload.pageTitle;
        this.emitChange();
    }

    updateShowHelp(showHelp) {
        this.showHelp = showHelp;
        this.emitChange();
    }

    updateShowDockunitSetup(showDockunitSetup) {
        this.showDockunitSetup = showDockunitSetup;
        this.emitChange();
    }

    getState() {
        return {
            csrfToken: this.csrfToken,
            pageTitle: this.pageTitle,
            showHelp: this.showHelp,
            showDockunitSetup: this.showDockunitSetup
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.csrfToken = state.csrfToken;
        this.pageTitle = state.pageTitle;
        this.showHelp = state.showHelp;
        this.showDockunitSetup = state.showDockunitSetup;
    }
}

ApplicationStore.storeName = 'ApplicationStore';

ApplicationStore.handlers = {
    'UPDATE_CSRF_TOKEN': 'setCsrfToken',
    'UPDATE_SHOW_HELP': 'updateShowHelp',
    'UPDATE_SHOW_DOCKUNIT_SETUP': 'updateShowDockunitSetup',
    'UPDATE_PAGE_TITLE': 'updatePageTitle'
};

export default ApplicationStore;

