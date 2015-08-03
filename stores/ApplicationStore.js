'use strict';

import {BaseStore} from 'fluxible/addons';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        
        this.csrfToken = null;
    }

    setCsrfToken(token) {
        this.csrfToken = token;
        this.emitChange();
    }

    getState() {
        return {
            csrfToken: this.csrfToken
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.csrfToken = state.csrfToken;
    }
}

ApplicationStore.storeName = 'ApplicationStore';

ApplicationStore.handlers = {
    'UPDATE_CSRF_TOKEN': 'setCsrfToken'
};

export default ApplicationStore;

