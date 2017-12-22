var mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User schema
var UserSchema = new Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	},

	email: {
		type: String
	},

	name: {
		type: String
	},
	profileimage: {
		type: String
	}
});


const User = mongoose.model("user", UserSchema);

module.exports = User;
