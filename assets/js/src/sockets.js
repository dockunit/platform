(function() {
	'use strict';

	var Socket = function() {
		this.socket = io();

		this.listen();
	};

	Socket.prototype.listen = function() {
		this.socket.on('completedBuild', function(message) {
			context._dispatcher.dispatch('UPDATE_PROJECT_BUILD', message);
		});

		this.socket.on('rerunBuild', function(message) {
			context._dispatcher.dispatch('UPDATE_PROJECT_BUILD', message);
		});

		this.socket.on('updatedBuild', function(message) {
			context._dispatcher.dispatch('UPDATE_PROJECT_BUILD', message);
		});

		this.socket.on('newBuild', function(message) {
			context._dispatcher.dispatch('NEW_PROJECT_BUILD', message);
		});
	};


	new Socket();

})();