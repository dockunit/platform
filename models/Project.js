'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = Schema({
	created: { type: Date, default: Date.now },
	repository: { type: String, required: true },
	branch: { type: String, required: true },
	user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	private: { type: Boolean, default: false }
});

module.exports = global.db.model('Project', schema);