'use strict'; 

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var Project = mongoose.model('Project');
var Build = mongoose.model('Build');
var NPromise = require('promise');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var Github = require('./Github');
var constants = require('../constants');
var Convert = require('ansi-to-html');

var Builder = function(user, project, buildId) {
	var self = this;

	self.socket = require('socket.io-client')('http://localhost:3000');
	self.ping = self.ping.bind(this);

	return new NPromise(function(fulfill, reject) {
		self.project = project;
		self.buildId = buildId;
		self.user = user;
		self.ping();

		var stepIndex = 0;

		var steps = [
			self.startProgressListener,
			self.getBuild,
			self.startContainer,
			self.finish
		];

		function run() {
			if (!steps[stepIndex]) {
				debug('Build complete');
				fulfill(self.build.output);
			} else {
				NPromise.resolve(steps[stepIndex].apply(self)).then(function(result) {
					stepIndex++;
					run();
				}, function(error) {
					if (self.progressInterval) {
						clearInterval(self.progressInterval)
					}

					debug('Exiting from error: ' + error);
					reject();
				});
			}
		}

		run();
	});
};

Builder.prototype.ping = function() {
	debug('Ping!');

	this.lastPing = new Date();
};

/**
 * This whole thing is a race condition. But the chances of a program continuing after doing
 * nothing for 30 minutes are extremely low.
 */
Builder.prototype.startProgressListener = function() {
	var self = this;

	debug('Start progress listener');

	self.progressInterval = setInterval(function(){
		var now = new Date();

		debug('Checking progress...');

		if (now.getTime() > self.lastPing.getTime() + (30 * 60 * 1000)) {
			debug('Have not received progress ping in over 30 minutes. Shutting down....');

			if (self.build) {
				self.build.output += "\n\nProcess timed out.";
				self.build.result = 1;

				self.finish().then(function() {
					process.exit(1);
				}, function(error) {
					process.exit(1);
				});
			} else {
				// This is really bad but should really never happen unless the project was deleted
				process.exit(1);
			}
		} else {
			debug('Progress within last 30 minutes :)');

			if (self.build) {
				self.socket.emit('updatedBuild', { build: self.build, user: self.user.username, repository: self.project.repository });
			}
		}
	}, 30 * 1000); // Runs every 30 seconds
};

Builder.prototype.getBuild = function() {
	var self = this;

	debug('Getting build model');

	return new NPromise(function(fulfill, reject) {

		Build.find({ _id: self.buildId }, function(error, builds) {
			self.ping();

			if (error || !builds.length) {
				debug('Could not get build');

				reject(new Error('Could not find build with id `' + self.buildId + '`'));
			} else {
				self.build = builds[0];

				self.build.output = '';
				self.build.result = 0;
				self.build.finished = null;
				self.build.started = new Date();

				self.build.save(function(error) {
					self.ping();

					if (error) {
						reject(new Error('Could not save updated build'));
					} else {
						debug('Emitting updated build to ' + self.user.username);

						self.socket.emit('updatedBuild', { build: self.build, user: self.user.username, repository: self.project.repository });

						fulfill();
					}
				});
			}
		});
	});
};

Builder.prototype.startContainer = function() {
	var self = this;

	return new NPromise(function(fulfill, reject) {
		debug('Starting git clone');

		debug('Start container');

		self.ping();

		var directory = '~';
		if (constants.isDevelopment) {
			directory = process.env.HOME + '/buildfiles'
		}

		var repository = self.project.repository;
		var commit = self.build.commit || 'pr-' + self.build.prNumber;

		var cloneCommand = 'rm -rf ' + directory + '/' + repository + '/' + commit + ' && git clone https://' + self.user.githubAccessToken + '@github.com/' + repository + '.git ' + directory + '/' + repository + '/' + commit + ' && cd ' + directory + '/' + repository + '/' + commit + ' && git reset --hard ' + commit;
		
		if ('pr' === self.build.type) {
			cloneCommand = 'rm -rf ' + directory + '/' + repository + '/' + commit + ' && git clone https://' + self.user.githubAccessToken + '@github.com/' + repository + '.git ' + directory + '/' + repository + '/' + commit + ' && cd ' + directory + '/' + repository + '/' + commit + ' && git fetch origin +refs/pull/' + self.build.prNumber + '/merge && git checkout -f FETCH_HEAD';
		}

		if (!constants.isDevelopment) {
			cloneCommand = 'ssh dockunit@worker-1 "' + cloneCommand + '"';
		}

		debug('Running: ' + cloneCommand);

		// Todo: This will need to be optmized later so it doesn't clone all the history
		exec(cloneCommand, function(error, stdout, stderr) {
			var called = false;

			self.ping();

			function dockunitCallback(code, signal) {
				self.ping();

				if (called) {
					return false;
				}

				called = true;

				debug('Dockunit command exited with code ' + code);
				self.build.result = code;
				
				var removeCommand = 'ssh dockunit@worker-1 "rm -rf ' + directory + '/' + repository + '/' + commit + '"';
				if (constants.isDevelopment) {
					removeCommand = 'rm -rf ' + directory + '/' + repository + '/' + commit;
				}

				debug('Executing: ' + removeCommand);

				exec(removeCommand, function(error, stdout, stderr) {
					self.ping();

					if (error) {
						debug('Could not remove repo files successfully');
					} else {
						debug('Removed repo files');
					}

					fulfill();
				});
			}

			if (error) {
				debug('Git clone failed');

				dockunitCallback(error, 1);
			} else {

				debug('Git clone finished');

				var convert = new Convert();

				var cmd,
					lastWrite = new Date();

				if (constants.isDevelopment) {
					debug('Running: dockunit ' + directory + '/' + repository + '/' + commit);

					cmd = spawn('dockunit', [directory + '/' + repository + '/' + commit]);
				} else {
					debug('Running: ssh dockunit@worker-1 "dockunit ' + directory + '/' + repository + '/' + commit + ' --du-verbose"');

					cmd = spawn('ssh', ['dockunit@worker-1', 'dockunit\ ' + directory + '/' + repository + '/' + commit + '\ --du-verbose']);
				}

				cmd.stdout.on('data', function(data) {
					self.ping();

					console.log('' + data);

					self.build.output += convert.toHtml('' + data);

					var now = new Date();

					if (now.getTime() > lastWrite.getTime() + (1000 * 30)) {
						lastWrite = new Date();

						self.build.save(function(error) {
							self.ping();

							if (error) {
								debug('Could not save build progress');
							} else {
								debug('Saved build progress');
							}
						});
					}
				});

				cmd.stderr.on('data', function(data) {
					self.ping();

					console.log('' + data);

					self.build.output += convert.toHtml('' + data);

					var now = new Date();

					if (now.getTime() > lastWrite.getTime() + (1000 * 30)) {
						lastWrite = new Date();
						
						self.build.save(function(error) {
							self.ping();

							if (error) {
								debug('Could not save build progress');
							} else {
								debug('Saved build progress');
							}
						});
					}
				});

				cmd.on('exit', dockunitCallback);
				cmd.on('disconnect', dockunitCallback);
				cmd.on('close', dockunitCallback);
				cmd.on('error', dockunitCallback);
			}
		});
	});
};

Builder.prototype.finish = function() {
	var self = this;

	debug('Finish build');

	return new NPromise(function(fulfill, reject) {
		self.ping();

		self.build.finished = new Date();

		self.build.save(function(error) {
			if (self.progressInterval) {
				clearInterval(self.progressInterval)
			}

			if (error) {
				debug('Could not save completed build');

				reject();
				return;
			}

			debug('Emitting completed build to ' + self.user.username);

			var status = 'success';
			if (1 === self.build.result) {
				status = 'error';
			} else if (2 === self.build.result) {
				status = 'failure';
			}

			if ('pr' === self.build.type) {
				Github.statuses.create(self.user.githubAccessToken, self.project.repository, self.user.username, self.build.prCommit, status, self.build.branch);
			} else {
				Github.statuses.create(self.user.githubAccessToken, self.project.repository, self.user.username, self.build.commit, status, self.build.branch);
			}

			self.socket.emit('completedBuild', { build: self.build, user: self.user.username, repository: self.project.repository });

			debug('Build finish saved to project');

			fulfill();
		});
	});
};

module.exports = Builder;
