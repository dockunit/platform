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

	return new NPromise(function(fulfill, reject) {
		self.project = project;
		self.buildId = buildId;
		self.user = user;
		self.output = '';

		var stepIndex = 0;

		var steps = [
			self.getBuild,
			self.startContainer,
			self.finish
		];

		function run() {
			if (!steps[stepIndex]) {
				debug('Build complete');
				fulfill(self.output);
			} else {
				NPromise.resolve(steps[stepIndex].apply(self)).then(function(result) {
					stepIndex++;
					run();
				}, function(error) {
					debug('Exiting from error: ' + error);
					reject();
				});
			}
		}

		run();
	});
};

Builder.prototype.getBuild = function() {
	var self = this;

	debug('Getting build model');

	return new NPromise(function(fulfill, reject) {

		Build.find({ _id: self.buildId }, function(error, builds) {
			if (error || !builds.length) {
				debug('Could not get build');

				reject(new Error('Could not find build with id `' + self.buildId + '`'));
			} else {
				self.build = builds[0];

				self.build.output = '';
				self.build.result = 0;
				self.build.finished = null;
				self.build.started = new Date();
				self.build.outputCode = null;

				self.build.save(function(error) {
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

		var directory = '~';
		if (constants.isDevelopment) {
			directory = process.env.HOME + '/buildfiles'
		}

		var repository = self.project.repository;
		var commit = self.build.commit;
		if ('pr' === self.build.type) {
			repository = self.build.prRepositoryName;
			commit = self.build.prCommit;
		}

		debug('Running - ssh dockunit@worker-1 "git clone https://' + self.user.githubAccessToken + '@github.com/' + repository + '.git ' + directory + '/' + repository + '/' + commit + ' && cd ' + directory + '/' + repository + '/' + commit + ' && git reset --hard ' + commit + '"');

		var cloneCommand = 'ssh dockunit@worker-1 "git clone https://' + self.user.githubAccessToken + '@github.com/' + repository + '.git ' + directory + '/' + repository + '/' + commit + ' && cd ' + directory + '/' + repository + '/' + commit + ' && git reset --hard ' + commit + '"';
		if (constants.isDevelopment) {
			cloneCommand = 'git clone https://' + self.user.githubAccessToken + '@github.com/' + repository + '.git ' + directory + '/' + repository + '/' + commit + ' && cd ' + directory + '/' + repository + '/' + commit + ' && git reset --hard ' + commit;
		}

		// Todo: This will need to be optmized later so it doesn't clone all the history
		exec(cloneCommand, function(error, stdout, stderr) {
			debug('Git clone finished');

			var cmd;

			if (constants.isDevelopment) {
				cmd = spawn('dockunit', [directory + '/' + repository + '/' + commit]);
			} else {
				cmd = spawn('ssh', ['dockunit@worker-1', 'dockunit\ ' + directory + '/' + repository + '/' + commit]);
			}

			cmd.stdout.on('data', function(data) {
				console.log('' + data);
				self.output += '' + data;
			});

			cmd.stderr.on('data', function(data) {
				console.log('' + data);
				self.output += '' + data;
			});

			var called = false;

			function dockunitCallback(code, signal) {
				if (called) {
					return false;
				}

				called = true;

				debug('Dockunit command exited with code ' + code);
				self.outputCode = code;

				var convert = new Convert();
				self.output = convert.toHtml(self.output.trim().replace(/^(\r\n|\n|\r)/g, '').replace(/(\r\n|\n|\r)$/g, ''));
				
				var removeCommand = 'ssh dockunit@worker-1 "rm -rf ' + directory + '/' + repository + '/' + commit + '"';
				if (constants.isDevelopment) {
					removeCommand = 'rm -rf ' + directory + '/' + repository + '/' + commit;
				}

				exec(removeCommand, function(error, stdout, stderr) {
					debug('Removed repo files');
					fulfill(self.output);
				});
			}

			cmd.on('exit', dockunitCallback);
			cmd.on('disconnect', dockunitCallback);
			cmd.on('close', dockunitCallback);
			cmd.on('error', dockunitCallback);

		});
	});
};

Builder.prototype.finish = function() {
	var self = this;

	debug('Finish build');

	return new NPromise(function(fulfill, reject) {
		self.build.output = self.output;
		self.build.finished = new Date();
		self.build.result = self.outputCode;

		self.build.save(function(error) {
			if (error) {
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

			if ('pr' === build.type) {
				Github.statuses.create(self.user.githubAccessToken, self.project.repository, self.user.username, self.build.prCommit, status, self.build.branch);
			} else {
				Github.statuses.create(self.user.githubAccessToken, self.project.repository, self.user.username, self.build.commit, status, self.build.branch);
			}

			self.socket.emit('completedBuild', { build: self.build, user: self.user.username, repository: self.project.repository });

			debug('Build finish saved to project');

			fulfill();
		})
	});
};

module.exports = Builder;
