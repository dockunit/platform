'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';
import {NavLink} from 'fluxible-router';

class Post extends React.Component {

	render() {
		let post = this.props.post;
		let avatarUrl = 'https://www.gravatar.com/avatar/' + post.author.email_hash + '?s=36';
		let singleUrl = '/blog/' + this.props.post.slug;

		return (
			<div id={post.slug} className="post">
				<If test={!this.props.single}>
					<h1><NavLink routeName="blogPost" navParams={{postSlug: post.slug}}>{post.title.rendered}</NavLink></h1>
				</If>

				<If test={this.props.single}>
					<h1>{post.title.rendered}</h1>
				</If>

				<div className="byline">
					<img className="avatar" src={avatarUrl} /> <strong>{post.author.display_name}</strong> <time class="timeago" datetime={post.date}>{timeago(post.date)}</time>
				</div>

				<div className="entry" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
			</div>
		);
	}
}

export default Post;
