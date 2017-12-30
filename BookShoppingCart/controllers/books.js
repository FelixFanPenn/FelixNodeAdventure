'use strict';

var mongoURI = require('../config/keys').mongoURI;
var db = require('monk')(mongoURI);
var Book = db.get('books');
var Category = db.get('categories');

module.exports = function (router) {
    router.get('/', function (req, res) {
        res.render('index');
    });

    router.get('/details/:id', function (req, res) {
        Book.findOne({_id: req.params.id}, function(err, book){
        	if (err) {
        		console.log(err);
        	} else {
        		var model = {
        			book: book
        		};

        		res.render('books/details', model);
        	}
        });
    });

};
