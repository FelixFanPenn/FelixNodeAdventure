var express = require('express');
var mongoURI = require('../config/keys').mongoURI;
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')(mongoURI);


router.get('/add', function(req, res, next) {

    var categories = db.get("categories");
	categories.find({}, {}, function(err, categories) {
		res.render('addpost', {
  			"title": "Add Post",
  			"categories": categories
  		});
	});
});


// :id will be the param in the url

// for some reason i cannot get findById to work. maybe an issue in npm mongo pkg
router.get('/show/:id', function(req, res, next) {
	var posts = db.get("posts");
	console.log(req.params.id);

	posts.find({"_id": req.params.id}, {}, function(err, posts) {
		res.render('show', {
			'post': posts[0]
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
	var imageName;

	if (req.file) {
		imageName = req.file.filename;
	} else {
		imageName = 'cat.jpeg';
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
			"mainimage": imageName
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



router.post('/addcomment', function(req, res, next) {

	// get form info
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var commentdate = new Date();

	// validation
	req.checkBody("name", "name field is required").notEmpty();
	req.checkBody("email", "email field is required").notEmpty();
	req.checkBody("email", "invalid email").isEmail();
	req.checkBody("body", "body field is required").notEmpty();

	// check errors
	var errors = req.validationErrors();
	if (errors) {
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('show', {
				"errors": errors,
				"post": post
			});
		});

	} else {
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentdate": commentdate
		}

		var posts = db.get("posts");

		posts.update({
				"_id": postid,
			},
			{
				$push:{
					"comments": comment
				}
			},
			function(err, doc) {
				if (err) {
					throw err;	
				} else {
					req.flash('success', "Comment Added");
					res.location('/posts/show/' + postid);
					res.redirect('/posts/show/' + postid);
				}
			}
		);
	}
});




module.exports = router;