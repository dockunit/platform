'use strict';

import React from 'react';
import If from './If';
import {connectToStores} from 'fluxible-addons-react';
import readPosts from '../actions/readPosts';
import PostsStore from '../stores/PostsStore';
import Post from './Post';

@connectToStores(['PostsStore'], (context, props) => ({
    PostsStore: context.getStore(PostsStore).getState()
}))
class Blog extends React.Component {
	constructor(props, context) {
        super(props, context);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func
    }
	
	componentDidMount() {
		if (null === this.props.PostsStore.posts) {
			this.context.executeAction(readPosts);
		}
	}

    render() {
    	return (
            <div className="container">
				<div className="blog">
					<If test={null === this.props.PostsStore.posts}>
						<div className="loading-section">
							<h3><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
						</div>
					</If>

					<If test={this.props.PostsStore.posts && !this.props.PostsStore.posts.length}>
						<p>Hey, no posts to show right now. Check back later!</p>
					</If>

					<If test={this.props.PostsStore.posts && this.props.PostsStore.posts.length}>
						<div className="posts">
							{this.props.PostsStore.posts && this.props.PostsStore.posts.map(function(post) {
								return <Post post={post} />     
			                })}
		                </div>
					</If>
				</div>
			</div>
        );
    }
}

export default Blog;
