'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = Schema({
	created: { type: Date, default: Date.now },
	started: { type: Date },
	finished: { type: Date },
	commit: { type: String },
	pullRequest: { type: String },
	branch: { type: String, required: true },
	commitUser: { type: String, required: true },
	output: { type: Object, required: true },
	result: { type: Number, default: 0 },
	passed: { type: Boolean, default: false },
	project: {
        type: Schema.ObjectId,
        ref: 'Project'
    }
});

module.exports = global.db.model('Build', schema);