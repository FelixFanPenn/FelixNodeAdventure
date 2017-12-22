var express = require('express');
var nodemailer = require('nodemailer');
var keys = require('../config/keys');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send', function(req, res, next) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: keys.google.email,
      pass: keys.google.password
    }
  });

  var mailOptions = {
    from: req.body.email,
    to: "xxxxxxx@gmail.com",
    subject: "email from " + req.body.name,
    text: req.body.message,
    html: '<p> You have a nice day!</p><ul><li>Name: ' + req.body.name + '</li><li>Message: ' + req.body.message + '</li></ul>'
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log("message sent. " + info.response);
      res.redirect('/');
    }
  });

});

module.exports = router;
