'use strict';

var mongoose = require('mongoose');
var kue = require('kue');
var debug = require('debug')('dockunit');
var constants = require('./constants');

global.db = mongoose.connect('mongodb://localhost/dockunit');

var Project = require('./models/Project');
var Build = require('./models/Build');

var Builder = require('./clients/Builder');

var queue = kue.createQueue();


queue.process('builder', function(payload, done) {
	debug('Worker registered');

	var builder = new Builder(payload.data.user, payload.data.project, payload.data.buildId).then(function(output) {
		debug('Worker finished successfully');

		done();
	}, function() {
		debug('Worker failed');

		done();
	});
});