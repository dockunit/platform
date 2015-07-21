'use strict';

var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');
var fetchrPlugin = require('fluxible-plugin-fetchr');

// create new fluxible instance
var app = new Fluxible({
    component: require('./components/Application.jsx')
});

// add routes to the routr plugin
app.plug(routrPlugin({
    routes: require('./configs/routes')
}));

app.plug(fetchrPlugin({
	xhrPath: '/api'
}));

// register stores
app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/ProjectsStore'));

module.exports = app;
