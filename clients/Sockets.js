'use strict'; 

var debug = require('debug')('dockunit');

var Sockets = function() {
	this.handleJoins();
	this.routeMessages();
};

Sockets.prototype.handleJoins = function() {
	global.io.on('connection', function(socket) {
		socket.on('join', function(message) {
			debug('Joining room ' + message.repository)
			socket.join(message.repository);
		});
	});
};

Sockets.prototype.routeMessages = function() {

	global.io.on('connection', function(socket) {

		socket.on('completedBuild', function(message) {
			debug('Routing completed build message to ' + message.repository);

			if (message.repository) {
				socket.in(message.repository).emit('completedBuild', message);
			}
		});

		socket.on('rerunBuild', function(message) {
			debug('Routing rerun build message to ' + message.repository);

			if (message.repository) {
				socket.in(message.repository).emit('rerunBuild', message);
			}
		});

		socket.on('updatedBuild', function(message) {
			debug('Routing updated build message to ' + message.repository);

			if (message.repository) {
				socket.in(message.repository).emit('updatedBuild', message);
			}
		});

		socket.on('newBuild', function(message) {
			debug('Routing new build message to ' + message.repository);

			if (message.repository) {
				socket.in(message.repository).emit('newBuild', message);
			}
		});

	});
};

module.exports = Sockets;