'use strict';

import React from 'react';
import If from './If';
import {connectToStores} from 'fluxible-addons-react';
import readPost from '../actions/readPost';
import PostsStore from '../stores/PostsStore';
import Post from './Post';
import {NavLink} from 'fluxible-router';

@connectToStores(['PostsStore'], (context, props) => ({
    PostsStore: context.getStore(PostsStore).getState()
}))
class BlogPost extends React.Component {
	constructor(props, context) {
        super(props, context);
    }

	static contextTypes = {
        getStore: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func
    }
	
	componentDidMount() {
		if ('undefined' === typeof this.props.PostsStore.posts[this.props.postSlug]) {
			this.context.executeAction(readPost, this.props.postSlug);
		}
	}

    render() {
    	return (
            <div className="container">
				<div className="blog">
					<If test={'undefined' === typeof this.props.PostsStore.posts[this.props.postSlug]}>
						<div className="loading-section">
							<h3><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></h3>
						</div>
					</If>

					<If test={false === this.props.PostsStore.posts[this.props.postSlug]}>
						<div className="no-post">
							<h3>We couldn't find this post. Sorry!</h3>
						</div>
					</If>

					<If test={this.props.PostsStore.posts[this.props.postSlug]}>
						<div className="posts">
							<Post single={true} post={this.props.PostsStore.posts[this.props.postSlug]} /> 
		                </div>
					</If>
				</div>
			</div>
        );
    }
}

export default BlogPost;
