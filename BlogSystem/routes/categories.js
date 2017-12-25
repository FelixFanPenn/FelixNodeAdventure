var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://felix:felix@ds137882.mlab.com:37882/blogsystem');


router.get('/add', function(req, res, next) {
  	res.render('addcategory', {
  		"title": "Add Category"
  	});
});


// how to get params from the url
router.get('/show/:category', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category: req.params.category}, {}, function(err, posts) {
		res.render(
			'index', 
			{
				"title": req.params.category,
				"posts": posts
			}
		);
	});

});

router.post('/add', function(req, res, next) {

	// get form info
	var title = req.body.title;

	// validation
	req.checkBody("title", "title field is required").notEmpty();

	// check errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('addcategory', {
			"errors": errors,
			"title": title
		});
	} else {
		var categories = db.get('categories');

		//submit to db
		categories.insert({
			"title": title
		}, function(err, category) {
			if (err) {
				res.send("There was an issue submitting the category");
			} else {
				req.flash('success', "category submitted");
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;