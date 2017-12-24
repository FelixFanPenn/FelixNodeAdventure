var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://felix:felix@ds137882.mlab.com:37882/blogsystem');


router.get('/add', function(req, res, next) {

    var categories = db.get("categories");
	categories.find({}, {}, function(err, categories) {
		res.render('addpost', {
  			"title": "Add Post",
  			"categories": categories
  		});
	});
});

router.post('/add', function(req, res, next) {

	// get form info
	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;
	var author = req.body.author;
	var date = new Date();

	if (req.files.mainimage) {
		var mainImageOriginalName = req.files.mainimage.originalname;
		var mainImageName = req.files.mainimage.name;
		var mainimageMime = req.files.mainimage.mimetype;
		var mainimagePath = req.files.mainimage.path;
		var mainimageExt = req.files.mainimage.extension;
		var mainimageSize = rqe.files.mainimage.size;
	} else {
		var mainImageName = 'cat.jpeg';
	}

	// validation
	req.checkBody("title", "title field is required").notEmpty();
	req.checkBody("body", "body field is required").notEmpty();

	// check errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('addpost', {
			"errors": errors,
			"title": title,
			"body": body
		});
	} else {
		var posts = db.get('posts');

		//submit to db
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainImageName
		}, function(err, post) {
			if (err) {
				res.send("There was an issue submitting the post");
			} else {
				req.flash('success', "post submitted");
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


module.exports = router;
