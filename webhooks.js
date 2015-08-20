'use strict';

var crypto = require('crypto');
var debug = require('debug')('dockunit');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var User = mongoose.model('User');
var NPromise = require('promise');
var kue = require('kue');
var constants = require('./constants');
var Builder = require('./clients/Builder');

debug = console.log;

var Webhooks = function() {
	var self = this;

	return function(req, res) {
		self.req = req;
		self.res = res;

		debug('Received webhooks request');

		var stepIndex = 0;

		var steps = [
			self.verifyRequestBody,
			self.verifyRequiredProperties,
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

			var build = {};
			build.commit = self.commit;
			build.branch = self.branch;
			build.output = '';
			build.ran = null;
			build.commitUser = self.commitUser;
			build = self.project.builds.create(build);

			self.project.builds.push(build);

			self.project.save(function(error) {
				if (error) {
					debug('Could not save project with new build');
					reject();
				} else {
					queue.create('builder', { user: user, repository: self.project.repository, buildId: build._id }).save(function(error){
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

Webhooks.prototype.verifyRequestBody = function() {
	debug('Verifying request body');

	if (!this.req.headers['content-type'] || 'application/json' !== this.req.headers['content-type']) {
		debug('Wrong content type');

		return new Error(500);
	}

	this.payload = this.req.body;
};

Webhooks.prototype.verifyRequiredProperties = function() {
	debug('Verifying required properties');

	if (!this.payload.repository.full_name) {
		debug('No repo full_name');

		return new Error(404);
	}
};

Webhooks.prototype.verifyAndGetProject = function() {
	var self = this;

	debug('Verify and get project');

	return new NPromise(function(fulfill, reject) {
		self.repository = self.payload.repository.full_name;
		self.commit = self.payload.after;
		self.commitUser = self.payload.head_commit.committer.username;
		self.branch = self.payload.ref.replace(/^refs\/heads\/(.*)$/ig, '$1');
		self.project = null;

		Project.find({ repository: self.repository }, function(error, projects) {
			if (error || !projects.length) {
				debug('Could not find project with repository `' + self.repository + '`');
				reject(new Error(400));
			} else {
				self.project = projects[0];
				debug('Found project');
				fulfill();
			}
		});
	});
};

module.exports = new Webhooks();