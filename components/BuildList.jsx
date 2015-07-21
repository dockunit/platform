'use strict';
var React = require('react');
var BuildListItem = require('./BuildListItem');
var LatestBuildListItem = require('./LatestBuildListItem');
var If = require('./If');

var BuildList = React.createClass({

	render: function() {
		var latestBuild = this.props.builds.shift();

		return (
			<div className="build-wrapper">
				<LatestBuildListItem build={latestBuild} branch={this.props.branch} repository={this.props.repository} />

				<div className="builds">
					{this.props.builds.map(function(build) {
	                    return <BuildListItem build={build} branch={this.props.branch} repository={this.props.repository} />     
	                }, this)}
                </div>
            </div>
		);
	}
});

module.exports = BuildList;
