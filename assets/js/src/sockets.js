(function() {
	'use strict';

	var Socket = function() {
		if (!this.isLoggedIn()) {
			return false;
		}

		this.socket = io(); 

		this.socket.emit('join', { user: this.user.username } );

		this.listen();
	};

	Socket.prototype.isLoggedIn = function() {
		try {
			this.user = App.context.dispatcher.stores.UserStore.currentUser;
		} catch(error) {
			this.user = null;
		}

		return !!this.user;
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