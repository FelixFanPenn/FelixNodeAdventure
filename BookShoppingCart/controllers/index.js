'use strict';

//var Book = require('../models/bookModel');
var mongoURI = require('../config/keys').mongoURI;
var db = require('monk')(mongoURI);


module.exports = function (router) {

    router.get('/', function (req, res) {

        var books = db.get('books');
        books.find({}, function(err, books){
        	if (err) {
        		console.log(err);
        	} else {

                for (var i = 0; i < books.length; i++) {
                    books[i].truncText = books[i].description.substring(0, 50);
                }

        		var model = {
        			books: books
        		};
                
        		res.render('index', model);
        	}
        });
        
    });

};
