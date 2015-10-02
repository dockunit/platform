'use strict';

var _ = require('lodash');

var baseUrl = 'https://dockunit.io';
var wpBase = 'https://dockunit.io/wp/wp-json/wp/v2/';
var isDevelopment = false;

if (process.env.BASE_URL) {
	baseUrl = process.env.BASE_URL;
} else if (process.env.NODE_ENV && 'dev' === process.env.NODE_ENV) {
	baseUrl = 'http://localhost:3000';
	isDevelopment = true;
}

module.exports = _.extend({
	baseUrl: baseUrl,
	isDevelopment: isDevelopment,
	wpBase: wpBase
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