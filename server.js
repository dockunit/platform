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
var navigateAction = require('fluxible-router').navigateAction;
var debug = require('debug')('dockunit');
var React = require('react');
var app = require('./app');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var htmlComponent = React.createFactory(require('./components/Html.jsx'));
var updateCsrfToken = require('./actions/updateCsrfToken');
var readHotProjects = require('./actions/readHotProjects');
var updateCurrentUser = require('./actions/updateCurrentUser');
var updateLoginHeaderStatus = require('./actions/updateLoginHeaderStatus');
var updateLoginFormStatus = require('./actions/updateLoginFormStatus');
var constants = require('./constants');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var createElement = require('fluxible-addons-react/createElementWithContext');
var sm = require('sitemap');
var favicon = require('express-favicon');
var robots = require('robots.txt');

var server = express();

server.set('state namespace', 'App');
server.use('/public', express.static(__dirname + '/build'));
server.use(cookieParser());
server.use(session({
	secret: constants.sessionSecret,
	resave: false,
	saveUninitialized: false,
	store: new RedisStore({
		host: '127.0.0.1',
		port: 6379
	})
}));

server.use(bodyParser.json({ limit: '20mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

// Create DB connection
global.db = mongoose.connect(constants.mongoServer);

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var User = require('./models/User');
var Project = require('./models/Project');
var Build = require('./models/Build');

server.post('/webhooks', require('./webhooks'));

var http = require('http').Server(server);

// Create Socket.io instance and setup client router
global.io = require('socket.io')(http);
var Sockets = new (require('./clients/Sockets'))();

server.use(csrf({cookie: true}));

var Github = require('./clients/Github');

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

var sitemap = sm.createSitemap({
	hostname: 'https://dockunit.io',
	cacheTime: 600000,        // 600 sec - cache purge period 
	urls: [
		{ url: '/',  changefreq: 'daily', priority: 0.8 },
		{ url: '/register/',  changefreq: 'daily', priority: 0.5 },
		{ url: '/about/',  changefreq: 'daily',  priority: 0.3 }
	]
});
 
server.get('/sitemap.xml', function(req, res) {
	sitemap.toXML(function (xml) {
		res.header('Content-Type', 'application/xml');
		res.send(xml);
	});
});

server.use(favicon(__dirname + '/assets/img/favicon.ico'));

server.use(robots(__dirname + '/robots.txt'));

server.use(function(req, res, next) {
	var url = req.url;

	if (url.match(/^\/svg\/*/i)) {
		var branch,
			repository,
			ImageBuilder,
			image,
			urlParse = url.match(/\/svg\/([^\/]+)\/([^?]+)(.*)?/i);

		if (urlParse) {
			repository = urlParse[1] + '/' + urlParse[2];

			if (!urlParse[3] || '?' === urlParse[3].trim()) {
				branch = false;
			} else {
				branch = urlParse[3].replace(/\?(.*)/ig, '$1');
				branch = branch.replace(/(.*)&(.*)/ig, '$1');
				if (branch.match(/^date=.*/ig)) {
					branch = false;
				}
			}

			res.set('Cache-Control', 'max-age=3600, must-revalidate');

			if (repository) {
				ImageBuilder = require('./clients/ImageBuilder');
				image = new ImageBuilder(repository, branch);

				image.build().then(function() {
					res.type('svg');
					res.send(image.getImage()).end();
				}, function() {
					res.type('svg');
					res.send('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>').end();
				});

				return;
			}
		}

		res.status(404).send('Not found').end();
	}

	return next();
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
			Github.tokens.create(req.query.code, req.user.username).then(function(token) {
				debug('Received github token ' + token);

				user.githubAccessToken = token;

				// GET username from token
				Github.tokens.getUser(token).then(function(githubUsername) {
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

	debug('Getting hot projects');
	context.executeAction(readHotProjects);

	debug('Executing navigate action');
    context.executeAction(navigateAction, {
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
            markup: React.renderToString(createElement(context))
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
