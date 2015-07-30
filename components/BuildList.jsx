'use strict';

import React from 'react';
import If from './If';
import BuildListItem from './BuildListItem';
import LatestBuildListItem from './LatestBuildListItem';

class BuildList extends React.Component;

	render: function() {
		let latestBuild = this.props.builds.shift();

		return (
			<div className="build-wrapper">
				<LatestBuildListItem currentUser={this.props.currentUser} build={latestBuild} branch={this.props.branch} repository={this.props.repository} />

				<div className="builds">
					{this.props.builds.map(function(build) {
	                    return <BuildListItem currentUser={this.props.currentUser} build={build} branch={this.props.branch} repository={this.props.repository} />     
	                }, this)}
                </div>
            </div>
		);
	}
});

export default BuildList;
