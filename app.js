'use strict';

import Fluxible from 'fluxible';
import Application from './components/Application';
import RouteStore from './stores/RouteStore';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import ApplicationStore from './stores/ApplicationStore';
import UserStore from './stores/UserStore';
import ProjectsStore from './stores/ProjectsStore';

// create new fluxible instance
let app = new Fluxible({
    component: Application,
    stores: [
		ApplicationStore,
		UserStore,
		ProjectsStore,
		RouteStore
	]
});

app.plug(fetchrPlugin({
	xhrPath: '/api'
}));

export default app;