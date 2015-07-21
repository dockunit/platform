'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var builds= Schema({
	ran: { type: Date, default: Date.now },
	finished: { type: Date },
	commit: { type: String, required: true },
	branch: { type: String, required: true },
	commitUser: { type: String, required: true },
	output: { type: Object, required: true },
	result: { type: Number, default: 0 },
	passed: { type: Boolean, default: false }
});

var schema = Schema({
	created: { type: Date, default: Date.now },
	repository: { type: String, required: true },
	branch: { type: String, required: true },
	latestBuild: { type: Schema.Types.Mixed, default: false },
	user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    builds: [builds]
});

module.exports = global.db.model('Project', schema);