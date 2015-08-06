'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        
        this.csrfToken = null;
        this.pageTitle = '';
    }

    setCsrfToken(token) {
        this.csrfToken = token;
        this.emitChange();
    }

    updatePageTitle(payload) {
        this.pageTitle = payload.pageTitle;
        this.emitChange();
    }

    getState() {
        return {
            csrfToken: this.csrfToken,
            pageTitle: this.pageTitle
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.csrfToken = state.csrfToken;
        this.pageTitle = state.pageTitle;
    }
}

ApplicationStore.storeName = 'ApplicationStore';

ApplicationStore.handlers = {
    'UPDATE_CSRF_TOKEN': 'setCsrfToken',
    'UPDATE_PAGE_TITLE': 'updatePageTitle'
};

export default ApplicationStore;

