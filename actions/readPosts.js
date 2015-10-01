/*global window, io */

'use strict';
import WP from 'wordpress-rest-api';
import constants from '../constants';

module.exports = function (context, payload, done) {
	var wp = new WP({ endpoint: constants.wpBase });

	wp.posts().get(function(error, posts) {
		if (error) {
			context.dispatch('READ_POSTS_FAILURE');
			done();
			return;
		}

		context.dispatch('READ_POSTS_SUCCESS', posts);
		done();
	});
};