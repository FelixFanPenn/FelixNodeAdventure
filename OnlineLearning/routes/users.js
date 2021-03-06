var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function(req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var street_address = req.body.street_address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;


  req.checkBody("first_name", "First name field is required").notEmpty();
  req.checkBody("last_name", "Last name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email must be a valid email address").isEmail();

  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(req.body.password);


  var errors = req.validationErrors();
  if (errors) {
  	res.render('users/signup', {
  		errors: errors,
  		first_name: first_name,
  		last_name: last_name,
  		street_address: street_address,
  		city: city,
  		state: state,
  		zip: zip,
  		email: email,
  		username: username,
  		password: password,
  		password2: password2
  	});
  } else {

  	var newUser = new User({
  		email: email,
  		username: username,
  		password: password,
  		type: type
  	});

  	if (type == 'student') {
  		var newStudent = new Student({
  			first_name: first_name,
  			last_name: last_name,
  			address: [{
  				street_address: street_address,
  				city: city,
  				state: state,
  				zip: zip
  			}],
  			email: email,
  			username: username
  		});
  		User.saveStudent(newUser, newStudent, function(err, user){
  			console.log('student created');
  		});
  	} else {
  		var newInstructor = new Instructor({
  			first_name: first_name,
  			last_name: last_name,
  			address: [{
  				street_address: street_address,
  				city: city,
  				state: state,
  				zip: zip
  			}],
  			email: email,
  			username: username
  		});

  		User.saveInstructor(newUser, newInstructor, function(err, user){
  			console.log('instructor created');
  		});
  	}

  	req.flash('success', 'User Added');
  	res.redirect('/');
  }


});

module.exports = router;
