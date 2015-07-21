/*global document, window */

'use strict';

var React = require('react');
var debug = require('debug')('dockunit');
var app = require('./app');
var dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support

debug('rehydrating app');

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, function(error, context) {
    if (error) {
        throw error;
    }
    
    window.context = context;
    var mountNode = document.getElementById('app');

    debug('React Rendering');
    React.render(context.createElement(), mountNode, function() {
        debug('React Rendered');
    });
});
