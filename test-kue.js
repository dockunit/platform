'use strict';

var constants = require('./constants');
var kue = require('kue');
var queue = kue.createQueue();

var params = {
	repository: 'tlovett1/custom-contact-forms',
	commit: '4390e8195ed0de6b7665a861d20d353f24f54920', //master
	//commit: 'b6dcfa3867a559623e7885dcc985e095329598fa', // develop
	branch: 'master',
	//branch: 'develop',
	commitUser: 'tlovett1'
};

var job = queue.create('builder', params).save(function(error){
	if (!error ) {
		process.exit();
	}
});
