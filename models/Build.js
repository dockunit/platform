'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = Schema({
	type: { type: String },
	branch: { type: String },
	commit: { type: String },
	commitUser: { type: String },

	prBaseCommit: { type: String },
	prBaseBranch: { type: String },
	prBaseUser: { type: String },
	prCommit: { type: String },
	prBranch: { type: String },
	prUser: { type: String },
	prRepositoryName: { type: String },
	prNumber: { type: Number },

	created: { type: Date, default: Date.now },
	started: { type: Date },
	finished: { type: Date },
	output: { type: Object, required: true },
	result: { type: Number, default: 0 },
	passed: { type: Boolean, default: false },
	project: {
        type: Schema.ObjectId,
        ref: 'Project'
    }
});

module.exports = global.db.model('Build', schema);