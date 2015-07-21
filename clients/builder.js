'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('dockunit');
var Project = mongoose.model('Project');
var NPromise = require('promise');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var github = require('./github');
var constants = require('../constants');

var debug = console.log;

var Builder = function(repository, commit, branch, commitUser, user) {
	var self = this;

	self.socket = require('socket.io-client')('http://localhost:3000');

	return new NPromise(function(fulfill, reject) {
		self.repository = repository;
		self.commit = commit;
		self.branch = branch;
		self.user = user;
		self.commitUser = commitUser;
		self.outputCode = null;
		self.output = '';

		var stepIndex = 0;

		var steps = [
			self.getProject,
			self.createBuild,
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

Builder.prototype.getProject = function() {
	var self = this;

	debug('Getting project');

	return new NPromise(function(fulfill, reject) {
		Project.find({ repository: self.repository }, function(error, projects) {
			if (error || !projects.length) {
				debug('Could not get project');

				reject(new Error('Could not find project with repository `' + self.repository + '`'));
			} else {
				self.project = projects[0];

				fulfill();
			}
		});
	});
};

Builder.prototype.createBuild = function() {
	var self = this;

	debug('Creating build model');

	return new NPromise(function(fulfill, reject) {
		var build = {};
		build.commit = self.commit;
		build.branch = self.branch;
		build.output = '';
		build.commitUser = self.commitUser;

		self.project.builds.push(build);

		self.build = self.project.builds[self.project.builds.length - 1];

		self.project.save(function(error) {
			if (error) {
				reject(new Error('Could not save project with new build'));
			} else {
				debug('Emitting new build to ' + self.user.username);

				github.statuses.create(self.user.githubAccessToken, self.repository, self.user.username, self.commit, 'pending');

				self.socket.emit('newBuild', { build: self.build, user: self.user.username, repository: self.repository });
				fulfill();
			}
		});
	});
};

Builder.prototype.finish = function() {
	var self = this;

	debug('Finish build');

	return new NPromise(function(fulfill, reject) {
		var build = self.project.builds.id(self.build._id);

		build.output = self.output;
		build.finished = new Date();
		build.result = self.outputCode;

		self.project.save(function(error) {
			if (error) {
				reject();
				return;
			}

			debug('Emitting completed build to ' + self.user.username);

			var status = 'success';
			if (1 === build.result) {
				status = 'error';
			} else if (2 === build.result) {
				status = 'failure';
			}

			github.statuses.create(self.user.githubAccessToken, self.repository, self.user.username, self.commit, status);

			self.socket.emit('completedBuild', { build: build, user: self.user.username, repository: self.repository });

			debug('Build finish saved to project');

			fulfill();
		})
	});
};

Builder.prototype.startContainer = function() {
	var self = this;

	return new NPromise(function(fulfill, reject) {
		debug('Starting git clone');

		debug('Start container');

		var directory = '/temp';
		if (constants.isDevelopment) {
			directory = process.env.HOME + '/buildfiles'
		}

		debug('Running - git clone https://github.com/' + self.repository + '.git ' + directory + '/' + self.repository + '/' + self.commit + ' && cd ' + directory + '/' + self.repository + '/' + self.commit + ' && git reset --hard ' + self.commit);

		// Todo: This will need to be optmized later so it doesn't clone all the history
		exec('git clone https://github.com/' + self.repository + '.git ' + directory + '/' + self.repository + '/' + self.commit + ' && cd ' + directory + '/' + self.repository + '/' + self.commit + ' && git reset --hard ' + self.commit, function(error, stdout, stderr) {
			debug('Git clone finished');

			var cmd = spawn('dockunit', [directory + '/' + self.repository + '/' + self.commit]);
			cmd.stdout.on('data', function(data) {
				console.log('' + data);
				self.output += '' + data;
			});

			cmd.stderr.on('data', function(data) {
				console.log('' + data);
				self.output += '' + data;
			});

			function dockunitCallback(code, signal) {
				console.log(arguments);

				debug('Dockunit command exited with code ' + code);
				self.outputCode = code;

				/*exec('rm -rf ' + directory + '/' + self.repository + '/' + self.commit, function(error, stdout, stderr) {
					debug('Removed repo files');
					fulfill(self.output);
				});*/
			}

			cmd.on('exit', dockunitCallback);
			cmd.on('disconnect', dockunitCallback);
			cmd.on('close', dockunitCallback);
			cmd.on('error', dockunitCallback);

		});
	});
};

module.exports = Builder;