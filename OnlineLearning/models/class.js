var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	instructor: {
		type: String
	},
	lessions: [{
		lesson_number: { type: Number },
		lesson_title: { type: String },
		lesson_body: { type: String }
	}]
});


//								    'classes' is collection name
var Class = module.exports = mongoose.model('classes', classSchema);

// fetch all classes
module.exports.getClasses = function(callback, limit){
	Class.find(callback).limit(limit);
}

// fetch a class
module.exports.getClassById = function(id, callback){
	Class.findById(id, callback);
}