'use strict';

var mongoURI = require('../config/keys').mongoURI;
var db = require('monk')(mongoURI);
var Book = db.get('books');
var Category = db.get('categories');

module.exports = function (router) {
    router.get('/books', function (req, res) {
        Book.find({}, function(err, books){
        	if (err) {
        		console.log(err);
        	} else {
        		var model = {
        			books: books
        		};

        		res.render('manage/books/index', model);
        	}
        });
    });

    router.get('/', function (req, res) {
        res.render('manage/index');
    });

    router.get('/categories', function (req, res) {
        Category.find({}, function(err, categories){
        	if (err) {
        		console.log(err);
        	} else {
        		var model = {
        			categories: categories
        		};

        		res.render('manage/categories/index', model);
        	}
        });
    });

};
