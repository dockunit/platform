'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcryptjs');
var md5 = require('MD5');

var SALT_WORK_FACTOR = 10;

var schema = new mongoose.Schema({
	registered: { type: Date, default: Date.now },
	email: { type: String, required: true, index: { unique: true } },
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	firstName: { type: String },
	githubAccessToken: { type: String },
	githubStateToken: { type: String },
	githubUsername: { type: String },
	lastName: { type: String },
	emailHash: { type: String }
});

// Generate Github state token
schema.pre('save', function(done) {
	var user = this;

	// Hash email for later
	if (user.email) {
		user.emailHash = md5(user.email);
	}

	if (user.isModified('githubAccessToken') || !user.githubStateToken) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
			if (error) {
				return done(error);
			}

			// hash the password using our new salt
			bcrypt.hash(Math.random() + '', salt, function(error, hash) {
				if (error) {
					return done(error);
				}

				user.githubStateToken = hash;
				done();
			});
		});
	} else {
		done();
	}
});

schema.pre('save', function(done) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) {
		return done();
	}

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
		if (error) {
			return done(error);
		}

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(error, hash) {
			if (error) {
				return done(error);
			}

			// override the cleartext password with the hashed one
			user.password = hash;
			done();
		});
	});
});

schema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
		if (error) {
			return callback(error);
		}
		callback(null, isMatch);
	});
};

schema.plugin(passportLocalMongoose);

module.exports = global.db.model('User', schema);