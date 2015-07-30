'use strict';

import React from 'react';
import Nav from './Nav';
import Register from './Register';
import Projects from './Projects';
import AddProject from './AddProject';
import About from './About';
import Login from './Login';
import Project from './Project';
import GithubAuthorize from './GithubAuthorize';
import ApplicationStore from '../stores/ApplicationStore';
import readMyProjects from '../actions/readMyProjects';
import UserStore from '../stores/UserStore';
import {connectToStores, provideContext} from 'fluxible-addons-react';
import {handleHistory} from 'fluxible-router';

@provideContext
@handleHistory({enableScroll: false})
@connectToStores(['ApplicationStore', 'UserStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState(),
    UserStore: context.getStore(UserStore).getState()
}))
class Application extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    }

    componentWillMount() {
        if (this.props.UserStore.currentUser) {
            this.context.executeAction(readMyProjects, { mine: true });
        }
    }

    render() {
        var Handler = this.props.currentRoute.get('handler');



        var repository = false;

        if ('project' === this.props.ApplicationStore.currentPageName) {
            repository = this.props.currentRoute.params[0] + '/' + this.props.currentRoute.params[1];
        }

        return (
            <div>
                <Nav selected={this.props.ApplicationStore.currentPageName} links={this.props.ApplicationStore.pages} />
                
                <Handler repository={repository} />

				<div className="container">
					<hr />
					<footer>
						<p>&copy; Dockunit.io 2015 | <a href="https://github.com/tlovett1/dockunit-platform">100% Open Source</a></p>
					</footer>
				</div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ApplicationStore.pageTitle === prevProps.ApplicationStore.pageTitle) {
            return;
        }
        document.title = this.props.ApplicationStore.pageTitle;
    }
}

export default Application
