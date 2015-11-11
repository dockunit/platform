'use strict';

import WP from 'wordpress-rest-api';
import constants from '../constants';

module.exports = function (context, payload, done) {
	var wp = new WP({ endpoint: constants.wpBase });

	wp.posts().slug(payload).get(function(error, posts) {
		if (error) {
			context.dispatch('READ_POST_FAILURE');
			done();
			return;
		}

		if (!posts.length) {
			posts = false;
		}

		context.dispatch('READ_POST_SUCCESS', { posts: posts, slug: payload });
		done();
	});
};