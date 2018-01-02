var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var async = require('async');

var userSchema = mongoose.Schema({
	username: {
		type: String
	},

	email: {
		type: String
	},

	password: {
		type: String,
		bcrypt: true
	},

	type: {
		type: String
	}
});


//								    'users' is collection name
var User = module.exports = mongoose.model('users', userSchema);

// fetch all classes
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

// fetch a class
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.saveStudent = function(newUser, newStudent, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if (err) {
			throw err;
		} else {
			newUser.password = hash;
			console.log('student is being saved');
			//async.parallel([newUser.save, newStudent.save], callback);
			newUser.save();
			newStudent.save();
		}
	});
}

module.exports.saveInstructor = function(newUser, newInstructor, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if (err) {
			throw err;
		} else {
			newUser.password = hash;
			console.log('instructor is being saved');
			//async.parallel([newUser.save, newInstructor.save], callback);
			newUser.save();
			newInstructor.save();
		}
	});
}