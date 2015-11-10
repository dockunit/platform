'use strict';

import {BaseStore} from 'fluxible/addons';
import _ from 'lodash';

class PostsStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);

		this.posts = {};
		this.mainLoadComplete = false;
		this.formatPostsObject = this.formatPostsObject.bind(this);
	}

	getState() {
		return {
			posts: this.posts,
			mainLoadComplete: this.mainLoadComplete
		};
	}

	dehydrate() {
		return this.getState();
	}

	rehydrate(state) {
		this.posts = state.posts;
		this.mainLoadComplete = state.mainLoadComplete;
	}

	readPostSuccess(posts) {
		this.posts = _.extend(this.posts, this.formatPostsObject(posts));

		this.emitChange();
	}

	readPostsSuccess(posts) {
		this.mainLoadComplete = true;

		this.posts = _.extend(this.posts, this.formatPostsObject(posts));

		this.emitChange();
	}

	readPostsFailure() {
		this.mainLoadComplete = true;
	}

	formatPostsObject(postsArray) {
		let postsObject = {};

		postsArray.forEach(function(post) {
			postsObject[post.slug] = post;
		});
		
		return postsObject;
	}
}

PostsStore.handlers = {
	'READ_POSTS_SUCCESS': 'readPostsSuccess',
	'READ_POSTS_FAILURE': 'readPostsFailure',
	'READ_POST_SUCCESS': 'readPostSuccess'
};

PostsStore.storeName = 'PostsStore';

export default PostsStore;