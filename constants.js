'use strict';

var _ = require('lodash');

var baseUrl = 'http://dockunit.io';
var isDevelopment = false;

if (process.env.BASE_URL) {
	baseUrl = process.env.BASE_URL;
} else if (process.env.NODE_ENV && 'dev' === process.env.NODE_ENV) {
	baseUrl = 'http://localhost:3000';
	isDevelopment = true;
}

module.exports = _.extend({
	baseUrl: baseUrl,
	isDevelopment: isDevelopment
}, require('../secrets'));

/**
 * Example secrets.js:
 *
 * module.exports = {
 *  githubClientId: 'xxxxxxx',
 *  githubClientSecret: 'xxxxxxx',
 *  githubWebhooksSecret: 'xxxxxxx',
 *  sessionSecret: 'xxxxxxx'
 * };
 */