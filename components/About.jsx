'use strict';

import React from 'react';

class About extends React.Component {
    render() {
        return (
            <div className="container">
				<h1 className="page-header">The Story</h1>

				<p>
					Dockunit.io is an experiment in Docker based integration tests. Following the release of 
					dockunit, a simple Node based utility for running Docker based unit tests, it became apparent 
					that something was missing. That something was an easy to use integration service. Dockunit.io 
					has been built to fill that void.
				</p>
			</div>
        );
    }
}

export default About;
