'use strict';

var crypto = require('crypto');
var debug = require('debug')('dockunit');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var User = mongoose.model('User');
var NPromise = require('promise');
var kue = require('kue');
var Github = require('./clients/Github');
var constants = require('./constants');
var Builder = require('./clients/Builder');
var Build = mongoose.model('Build');

var Webhooks = function() {
	var self = this;

	return function(req, res) {
		self.req = req;
		self.res = res;
		self.socket = require('socket.io-client')('http://localhost:3000');

		debug('Received webhooks request');

		var stepIndex = 0;

		var steps = [
			self.verifyRequestBody,
			//self.verifyRequiredProperties,
			self.verifyAndGetProject,
			self.createJob
		];

		if (!constants.isDevelopment) {
			steps.unshift(self.verifySignature);
		}

		function run() {
			if (!steps[stepIndex]) {
				debug('Successful processed webhook request');
				self.res.end();
			}

			NPromise.resolve(steps[stepIndex].apply(self)).then(function(result) {
				if (result instanceof Error) {
					self.res.status(result.message);
					self.res.end();
				} else {
					stepIndex++;
					run();
				}
			}, function(error) {
				debug('Error in step occured: ' + error);
				self.res.status(error.message);
				self.res.end();
			});
		}

		run();
	};
};

Webhooks.prototype.verifySignature = function() {
	debug('Verifying signature');

	if (!this.req.headers['x-hub-signature']) {
		debug('No signature to verify');
		return new Error(403);
	}

	var hash = 'sha1=' + crypto.createHmac('sha1', constants.githubWebhooksSecret).update(JSON.stringify(this.req.body)).digest('hex');

	if (hash !== this.req.headers['x-hub-signature']) {
		debug('Signature mismatch');
		return new Error(403);
	}
};

Webhooks.prototype.verifyRequestBody = function() {
	debug('Verifying request body');

	if (!this.req.headers['content-type'] || 'application/json' !== this.req.headers['content-type']) {
		debug('Wrong content type');

		return new Error(500);
	}

	this.payload = this.req.body;

	if ('opened' === this.payload.action && this.payload.pull_request) {
		this.type = 'pr';

		if (!this.payload.pull_request.mergeable) {
			debug('Pull request not mergeable');

			return new Error(204);
		}
	} else {
		this.type = 'commit';
	}

	if (this.payload.ref && this.payload.ref.match(/^refs\/tags/i)) {
		debug('No need to build a tag push');

		return new Error(204);
	}

	debug(this.payload);
};

Webhooks.prototype.verifyRequiredProperties = function() {
	debug('Verifying required properties');

	/*if (!this.payload.repository.full_name) {
		debug('No repo full_name');

		return new Error(404);
	}*/
};

Webhooks.prototype.verifyAndGetProject = function() {
	var self = this;

	debug('Verify and get project');

	return new NPromise(function(fulfill, reject) {
		self.repository = self.payload.repository.full_name;

		if ('commit' === self.type) {
			debug('Creating commit build');

			self.commit = self.payload.after;
			self.commitUser = self.payload.head_commit.committer.username;
			self.branch = self.payload.ref.replace(/^refs\/heads\/(.*)$/ig, '$1');
		} else {
			debug('Creating pull request build');

			self.prBaseCommit = self.payload.pull_request.base.sha;
			self.prBaseBranch = self.payload.pull_request.base.ref;
			self.prBaseUser = self.payload.pull_request.base.user.login;

			self.prCommit = self.payload.pull_request.head.sha;
			self.prBranch = self.payload.pull_request.head.ref;
			self.prUser = self.payload.pull_request.head.user.login;
			self.branch = 'pr-' + self.payload.number;
			self.prNumber = self.payload.number;

			self.prRepositoryName = self.payload.pull_request.head.repo.full_name;
		}

		self.project = null;

		Project.find({ repository: self.repository }, function(error, projects) {
			if (error || !projects.length) {
				debug('Could not find project with repository `' + self.repository + '`');
				reject(new Error(400));
			} else {
				self.project = projects[0];
				debug('Found project');
				debug(self.project);
				fulfill();
			}
		});
	});
};

Webhooks.prototype.createJob = function() {
	var self = this;

	debug('Creating job');

	return new NPromise(function(fulfill, reject) {
		var queue = kue.createQueue();

		debug('Finding user with id ' + self.project.user);

		User.findById(self.project.user, function(error, user) {
			if (error || !user) {
				debug('Could not find user associated with project');
				reject();
				return;
			}

			var build = new Build();
			build.type = self.type;

			if ('commit' === self.type) {
				build.commitUser = self.commitUser;
				build.commit = self.commit;
			} else {
				build.prCommit = self.prCommit;
				build.prBranch = self.prBranch;
				build.prUser = self.prUser;
				build.prBaseCommit = self.prBaseCommit;
				build.prBaseBranch = self.prBaseBranch;
				build.prBaseUser = self.prBaseUser;
				build.prRepositoryName = self.prRepositoryName;
				build.prNumber = self.prNumber;
			}

			build.branch = self.branch;
			build.output = '';
			build.project = self.project._id;
			build.ran = null;

			build.save(function(error) {
				if (error) {
					debug('Could not save new build');
					reject();
				} else {
					self.socket.emit('newBuild', { build: build, user: user.username, repository: self.project.repository });

					if ('pr' === build.type) {
						Github.statuses.create(user.githubAccessToken, self.project.repository, user.username, build.prCommit, 'pending', build.branch);
					} else {
						Github.statuses.create(user.githubAccessToken, self.project.repository, user.username, build.commit, 'pending', build.branch);
					}

					queue.create('builder', { user: user, project: self.project, repository: self.project.repository, buildId: build._id }).save(function(error){
						if (error) {
							debug('Could not save builder job');
						} else {
							debug('Builder job created');
						}

						fulfill();
					});
				}
			});
		});
	});
};

module.exports = new Webhooks();
