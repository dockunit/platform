'use strict'; 

var debug = require('debug')('dockunit');

var Sockets = function() {
	this.handleJoins();
	this.routeMessages();
};

Sockets.prototype.handleJoins = function() {
	global.io.on('connection', function(socket) {
		socket.on('join', function(message) {
			debug('Joining room ' + message.user)
			socket.join(message.user);
		});
	});
};

Sockets.prototype.routeMessages = function() {

	global.io.on('connection', function(socket) {

		socket.on('completedBuild', function(message) {
			debug('Routing completed build message to ' + message.user);

			if (message.user) {
				socket.in(message.user).emit('completedBuild', message);
			}
		});

		socket.on('rerunBuild', function(message) {
			debug('Routing rerun build message to ' + message.user);

			if (message.user) {
				socket.in(message.user).emit('rerunBuild', message);
			}
		});

		socket.on('updatedBuild', function(message) {
			debug('Routing updated build message to ' + message.user);

			if (message.user) {
				socket.in(message.user).emit('updatedBuild', message);
			}
		});

		socket.on('newBuild', function(message) {
			debug('Routing new build message to ' + message.user);

			if (message.user) {
				socket.in(message.user).emit('newBuild', message);
			}
		});

	});
};

module.exports = Sockets;