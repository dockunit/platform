'use strict';

var _ = require('lodash');

var baseUrl = 'https://dockunit.io';
var isDevelopment = false;

if (process.env.BASE_URL) {
	baseUrl = process.env.BASE_URL;
} else if (process.env.NODE_ENV && 'production' !== process.env.NODE_ENV) {
	baseUrl = 'http://localhost:3000';
	isDevelopment = true;
}

module.exports = _.extend({
	baseUrl: baseUrl,
	googleReCAPTCHASiteKey: '6LdzKAwTAAAAAIk4VA_9ZPGl7QjVn6FkiCPk0LmY',
	isDevelopment: isDevelopment
}, require('../secrets'));

/**
 * Example secrets.js:
 *
 * module.exports = {
 *  githubClientId: 'xxxxxxx',
 *  githubClientSecret: 'xxxxxxx',
 *  githubWebhooksSecret: 'xxxxxxx',
 *  sessionSecret: 'xxxxxxx',
 *  googleReCAPTCHASecretKey: 'xxxxxx',
 *  mailchimpListId: 'xxxxxx',
 *  mailchimpAPIKey: 'xxxxxx',
 * };
 */