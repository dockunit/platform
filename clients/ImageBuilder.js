'use strict'; 

import NPromise from 'promise';
import mongoose from 'mongoose';

var Project = mongoose.model('Project');
var debug = require('debug')('dockunit');

class ImageBuilder {
	constructor(repository, branch) {
		let self = this;
		debug('Creating image with repository ' + repository);

		self.repository = repository;
		self.branch = branch || false;
		self.image = '';
	}

	build() {
		let self = this;

		return new NPromise(function(fulfill, reject) {
			let stepIndex = 0;

			let steps = [
				self.getBranchBuildStatus,
				self.generateImage
			];

			function run() {
				if (!steps[stepIndex]) {
					debug('Finished image builder');
					fulfill();
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
	}

	getBranchBuildStatus() {
		let self = this;

		debug('Getting branch build');

		return new NPromise(function(fulfill, reject) {
			Project.find({ repository: self.repository }, function(error, projects) {
				if (error || !projects.length) {
					debug('Could not get project');

					reject(new Error('Could not find project with repository `' + self.repository + '`'));
				} else {
					self.project = projects[0];

					if (!self.branch) {
						self.branch = self.project.branch;
					}
					self.branchBuild = self.project.builds.filter(function(build) {
						return build.branch === self.branch;
					}).pop();

					if (!self.branchBuild) {
						reject(new Error('Could not find a build for branch `' + self.branch + '`'));
					} else {
						debug('Result ' + self.branchBuild.result + ' saved');

						self.result = self.branchBuild.result;
						fulfill();
					}
				}
			});
		});
	}

	generateImage() {
		let self = this;

		debug('Generating image');

		return new NPromise(function(fulfill, reject) {
			let buildText = 'failed';
			let buildColor = '#e05d44';

			if (!self.branchBuild.finished) {
				buildText = 'running';
				buildColor = 'yellow';
			} else if (0 === self.result) {
				buildText = 'passing';
				buildColor = '#4c1';
			} else if (255 === self.result) {
				buildText = 'errored';
				buildColor = 'orange';
			}

			self.image = '<svg xmlns="http://www.w3.org/2000/svg" width="110" height="20">' +
						 	'<linearGradient id="a" x2="0" y2="100%">' + 
						 		'<stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/>' +
						 	'</linearGradient>' + 
						 	'<rect rx="3" width="110" height="20" fill="#555"/>' + 
						 	'<rect rx="3" x="57" width="53" height="20" fill="' + buildColor + '"/>' +
						 	'<path fill="' + buildColor + '" d="M57 0h4v20h-4z"/>' + 
						 	'<rect rx="3" width="110" height="20" fill="url(#a)"/>' + 
						 	'<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">' + 
						 		'<text x="28" y="15" fill="#010101" fill-opacity=".3">dockunit</text>' + 
						 		'<text x="28" y="14">dockunit</text>' + 
						 		'<text x="82.5" y="15" fill="#010101" fill-opacity=".3">' + buildText + '</text>' + 
						 		'<text x="82.5" y="14">' + buildText + '</text>' + 
						 	'</g>' + 
						 '</svg><!--' + 
						 	'Build id: ' + self.branchBuild._id +', ' + 
						 	'Result: ' + self.result + ', ' + 
						 	'Finished: ' + self.branchBuild.finished +
						 	'-->';
			fulfill();
		});
	}

	getImage() {
		return this.image;
	}
}

module.exports = ImageBuilder;