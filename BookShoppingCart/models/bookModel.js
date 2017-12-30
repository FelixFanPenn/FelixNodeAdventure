'use strict';

var mongoose = require('mongoose');
var bookModel = function(){
	var bookSchema = mongoose.Schema({
		title: String,
		description: String,
		category: String,
		author: String,
		publisher: String,
		price: Number,
		cover: String
	});

	// a function to shorten text
	bookSchema.methods.trunText = function(length) {
		return this.description.substring(0, length);
	}

	return mongoose.model("Book", bookSchema);
};

module.exports = new bookModel();

