var express = require('express');
var router = express.Router();

var Class = require('../models/class');


router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('classes/index', {"classes": classes});
		}
	}, 3);

});

router.get('/:id/details', function(req, res, next) {
	Class.getClassById([req.params.id], function(err, className){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('classes/details', {"class": className});
		}
	});

});


module.exports = router;
