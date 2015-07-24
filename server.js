'use strict';

/*
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
 	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

require('babel/register');

var express = require('express');
var serialize = require('serialize-javascript');
var navigateAction = require('flux-router-component').navigateAction;
var debug = require('debug')('dockunit');
var React = require('react');
var app = require('./app');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var htmlComponent = React.createFactory(require('./components/Html.jsx'));
var updateCsrfToken = require('./actions/updateCsrfToken');
var updateCurrentUser = require('./actions/updateCurrentUser');
var updateLoginHeaderStatus = require('./actions/updateLoginHeaderStatus');
var updateLoginFormStatus = require('./actions/updateLoginFormStatus');
var constants = require('./constants');

var server = express();

server.set('state namespace', 'App');
server.use('/public', express.static(__dirname + '/build'));
server.use(cookieParser());
server.use(require('express-session')({
	secret: constants.sessionSecret,
	resave: false,
	saveUninitialized: false
}));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

// Create DB connection
global.db = mongoose.connect('mongodb://localhost/dockunit');

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var User = require('./models/User');
var Project = require('./models/Project');

server.post('/webhooks', require('./webhooks'));

var http = require('http').Server(server);

// Create Socket.io instance and setup client router
global.io = require('socket.io')(http);
var sockets = new (require('./clients/sockets'))();

server.use(csrf({cookie: true}));

var github = require('./clients/github');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// Setup passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			debug('User not found');
			return done(null, false, { message: 'Unknown user ' + username });
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if(isMatch) {
				return done(null, user);
			} else {
				debug('Password mismatch');
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

server.use(passport.initialize());
server.use(passport.session());


// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our "REST" services
fetchrPlugin.registerService(require('./services/users'));
fetchrPlugin.registerService(require('./services/projects'));
fetchrPlugin.registerService(require('./services/github'));
fetchrPlugin.registerService(require('./services/builds'));

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

server.get('/*.svg', function(req, res, next) {
	var ImageBuilder = require('./clients/image-builder');

	var image = new ImageBuilder(req);

    res.write(image.toString());
    res.end();
});

// Handle login
server.post('/login', function(req, res, next) {
	passport.authenticate('local', function(error, user, info) {
		if (error) {
			return next(error);
		}

		var url = req.body.redirectPath || '/';

		if (!user) {
			debug('Could not find user or wrong password');
			req.session.errorNum = 1;
			req.session.loginType = req.body.type;
			req.session.redirectUrl = url;

			return res.redirect(url);
		}

		req.logIn(user, function(error) {
			if (error) {
				return next(error);
			}

			debug('Logging in user');

			if ('/login' === url) {
				url = '/';
			}

			return res.redirect(url);
		});

	})(req, res, next);
});

// Handle logout
server.get('/logout', function(req, res){
	debug('Logging out');
	req.logout();
	res.redirect('/');
});

// Handle Github access token
server.get('/projects/authorize', function(req, res){
	if (req.user) {
		var user = req.user.toObject();

		if (req.query && user.githubStateToken === req.query.state && req.query.code) {
			// POST to github for access token :)
			github.tokens.create(req.query.code, req.user.username).then(function(token) {
				debug('Received github token ' + token);

				user.githubAccessToken = token;

				// GET username from token
				github.tokens.getUser(token).then(function(githubUsername) {
					debug('Received github username ' + githubUsername);

					var userQuery = User.find({ username: user.username });

					userQuery.update({ githubAccessToken: token, githubUsername: githubUsername }, function() {
						res.redirect('/projects');

					});
				});
			});
		}
	}

});

// Handle main request
server.use(function(req, res, next) {
	var context = app.createContext({
		req: req,
		xhrContext: {
			_csrf: req.csrfToken()
		}
	});

	if (req.user) {
		var user = req.user.toObject();

		debug('Updating current user context to ' + user);

		context.executeAction(updateLoginHeaderStatus, 0);
		context.executeAction(updateLoginFormStatus, 0);
		req.session.errorNum = 0;
		context.executeAction(updateCurrentUser, user);
	} else if (req.session && req.session.errorNum && 1 === req.session.errorNum) {
		debug('Updating login status');

		if ('header' === req.session.loginType) {
			context.executeAction(updateLoginHeaderStatus, req.session.errorNum);
		} else {
			context.executeAction(updateLoginFormStatus, req.session.errorNum);
		}
	}

    debug('Setting Csrf token to ' + req.csrfToken());
	context.executeAction(updateCsrfToken, req.csrfToken());

	debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url,
		method: req.method
    }, function (err) {
        if (err) {
            if (err.status && err.status === 404) {
                next();
            } else {
                next(err);
            }
            return;
        }

        debug('Exposing context state');
        var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        debug('Rendering Application component into html');
        var html = React.renderToStaticMarkup(htmlComponent({
            context: context.getComponentContext(),
            state: exposed,
            markup: React.renderToString(context.createElement())
        }));

        debug('Sending markup');
        res.type('html');
        res.write('<!DOCTYPE html>' + html);
        res.end();
    });
});

server.set('port', process.env.PORT || 3000);

http.listen(server.get('port'), function() {
	console.log('Listening on port ' + server.get('port'));
});
