var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var bcrypt = require('bcrypt');
var keys = require('../config/keys');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title': 'Login'
  });
});

router.post('/register', function(req, res, next) {
  // get form values
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var password2 = req.body.password2;


  if (req.files.profileimage) {
	console.log("image uploading");
	var profileImageOriginalName = req.files.profileimage.originalName;
	var profileImageName = req.files.profileimage.name;
	var profileImageMime = req.files.profileimage.mimetype;
	var profileImagePath = req.files.profileimage.path;
	var profileImageExt = req.files.profileimage.extension;
	var profileImageSize = req.files.profileimage.size;
  } else {
	//set a default image
	var profileImageName = 'noimage.png';
  }


  // form validation using validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
  	res.render('register', {
  		errors: errors,
  		name: name,
  		email: email,
  		username: username,
  		password: password,
  		password2: password2
  	});
  } else {

  	User.findOne({
  		username: username
  	}).then((curUser) => {
  		if (curUser) {
  			console.log('user exists');
  			done(null, curUser);
  		} else {

  			var saltRounds = keys.bcrypt.saltRounds;
  			bcrypt.genSalt(saltRounds, function(err, salt) {
    			bcrypt.hash(password, salt, function(err, hash) {
    				if (err) throw err;
        			new User({
		  	  			name: name,
  						email: email,
  						username: username,
		  				password: hash,
		  				profileimage: profileImageName
  					}).save().then((newUser) => {
  						console.log('new user saved');
  						done(null, newUser);
  					});
    			});
			  });

  		}
  	});

  	//success msg
  	req.flash("success", "You are now registered and may login.");
  	res.location('/');
  	res.redirect('/users/login');
  }
});


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { 
        console.log('Err');
        return done(err); 
      }
      if (!user) { 
        console.log('No user');
        return done(null, false, {message: "Unknown User"}); 
      }

      bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) {
            console.log("Something wrong happened. Redirecting to Login page");
            return;
          } else {
            if (!isMatch) {
              console.log("Invalid username and password combo.");
              done(null, false, {message: 'Invalid username and password combo'});
            } else {
              done(null, user);
            }
          }
      });
    });
  }

));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username and password combo'}), function(req, res){
  console.log('success');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', "You have logged out");
  res.redirect('/users/login');
});


module.exports = router;



