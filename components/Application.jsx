'use strict';

import React from 'react';
import Nav from './Nav';
import Login from './Login';
import GithubAuthorize from './GithubAuthorize';
import ApplicationStore from '../stores/ApplicationStore';
import readMyProjects from '../actions/readMyProjects';
import UserStore from '../stores/UserStore';
import {connectToStores, provideContext} from 'fluxible-addons-react';
import {handleHistory} from 'fluxible-router';
import {navigateAction} from 'fluxible-router';

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
        let Handler = this.props.currentRoute.get('handler');
        let params = this.props.currentRoute.get('params');
        let repository = false;
        let redirectPath = false;

        if ('project' === this.props.currentRoute.get('page')) {
            repository = params.get('username') + '/' + params.get('repository');
        }

        if (!this.props.UserStore.currentUser) {
            if ('projects' === this.props.currentRoute.get('page') || 'addProject' === this.props.currentRoute.get('page') || 'githubAuthorize' === this.props.currentRoute.get('page')) {
                Handler = Login;
                redirectPath = this.props.currentRoute.get('path');
            }
        } else {
            if (!this.props.UserStore.currentUser.githubAccessToken) {
                if ('projects' === this.props.currentRoute.get('page') || 'addProject' === this.props.currentRoute.get('page')) {
                    Handler = GithubAuthorize;
                    redirectPath = this.props.currentRoute.get('path');
                }
            }
        }

        return (
            <div>
                <Nav selected={this.props.currentRoute.get('page')} redirectPath={redirectPath} />
                
                <Handler repository={repository} redirectPath={redirectPath} />

				<div className="container">
					<hr />
					<footer>
						<p>&copy; Dockunit.io 2015 <a href="https://twiter.com/dockunitio" className="icomoon icomoon-twitter"></a>  <a href="mailto:admin@dockunit.io" className="icomoon icomoon-mail"></a> <span className="separator">|</span> <a href="https://github.com/dockunit/platform">100% Open Source</a></p>
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
