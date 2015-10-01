'use strict';

import React from 'react';
import If from './If';
import timeago from 'timeago';

class Post extends React.Component {

	render() {
		console.log(this.props);
		let post = this.props.post;

		return (
			<div className="post">
				<h2>{post.title.rendered}</h2>
				<div className="byline">
					<time class="timeago" datetime={post.date}>{timeago(post.date)}</time>
				</div>

				<div className="entry" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
			</div>
		);
	}
}

export default Post;
