'use strict';

import {BaseStore} from 'fluxible/addons';

class PostsStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);

		this.posts = null;
	}

	getState() {
		return {
			posts: this.posts
		};
	}

	dehydrate() {
		return this.getState();
	}

	rehydrate(state) {
		this.posts = state.posts;
	}

	readPostsSuccess(posts) {
		this.posts = posts;
		this.emitChange();
	}
}

PostsStore.handlers = {
	'READ_POSTS_SUCCESS': 'readPostsSuccess'
};

PostsStore.storeName = 'PostsStore';

export default PostsStore;