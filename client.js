/*global document, window */

'use strict';

import React from 'react';
import app from './app';
import {createElementWithContext} from 'fluxible-addons-react';
var debug = require('debug')('dockunit');

let dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support

debug('rehydrating app');

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, function(error, context) {
    if (error) {
        throw error;
    }
    
    window.context = context;
    let mountNode = document.getElementById('app');

    debug('React Rendering');
    React.render(createElementWithContext(context), mountNode, function() {
        debug('React Rendered');
    });
});
