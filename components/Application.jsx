'use strict';

var React = require('react');
var Nav = require('./Nav.jsx');
var Register = require('./Register.jsx');
var Home = require('./Home.jsx');
var Projects = require('./Projects.jsx');
var AddProject = require('./AddProject.jsx');
var About = require('./About.jsx');
var Login = require('./Login.jsx');
var Project = require('./Project.jsx');
var GithubAuthorize = require('./GithubAuthorize.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var RouterMixin = require('flux-router-component').RouterMixin;
var readMyProjects = require('../actions/readMyProjects');
var UserStore = require('../stores/UserStore');

var Application = React.createClass({
    mixins: [RouterMixin],

    statics: {
        storeListeners: {
            onApplicationStoreChange: [ApplicationStore],
            onUserStoreChange: [UserStore]
        }
    },

    contextTypes: {
        executeAction: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        if (this.context.getStore(UserStore).getCurrentUser()) {
            this.context.executeAction(readMyProjects, { mine: true });
        }

        return this.getState();
    },

    getState: function() {
        var appStore = this.context.getStore(ApplicationStore);

        return {
            currentPageName: appStore.getCurrentPageName(),
            pageTitle: appStore.getPageTitle(),
            route: appStore.getCurrentRoute(),
            pages: appStore.getPages()
        };
    },

    onApplicationStoreChange: function() {
        this.setState(this.getState());
    },

    onUserStoreChange: function() {
        if (this.context.getStore(UserStore).getCurrentUser()) {
            this.context.executeAction(readMyProjects);
        }
    },

    render: function() {
        var output = '';
        var repository = this.state.route.params[0] + '/' + this.state.route.params[1];

        switch (this.state.currentPageName) {
			case 'home':
                output = <Home />;
                break;
            case 'about':
                output = <About />;
                break;
			case 'projects':
				output = <Projects />;
				break;
			case 'login':
				output = <Login />;
				break;
			case 'addProject':
				output = <AddProject />;
				break;
			case 'githubAuthorize':
				output = <GithubAuthorize />;
				break;
			case 'register':
                output = <Register />;
                break;
            case 'project':
                output = <Project repository={repository} />;
                break;
        }
        return (
            <div>
                <Nav selected={this.state.currentPageName} links={this.state.pages} />

				{output}

				<div className="container">
					<hr />
					<footer>
						<p>&copy; Dockunit.io 2015 | <a href="https://github.com/tlovett1/dockunit-platform">100% Open Source</a></p>
					</footer>
				</div>
            </div>
        );
    },

    componentDidUpdate: function(prevProps, prevState) {
        var newState = this.state;
        if (newState.pageTitle === prevState.pageTitle) {
            return;
        }
        document.title = newState.pageTitle;
    }
});

module.exports = Application;
