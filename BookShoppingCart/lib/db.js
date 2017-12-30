'use strict';

var mongoose = require('mongoose');
var mongoURI = require('../config/keys').mongoURI;
var db = function() {
	return {
		config: function(conf) {
			mongoose.connect(mongoURI);
			var db = mongoose.connection;
			db.on('error', console.error.bind(console, "connection error"));
			db.once('open', function() {
				console.log("db connected");
			});
		}
	};
}

module.exports = db();