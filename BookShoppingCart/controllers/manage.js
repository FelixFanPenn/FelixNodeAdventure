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

    router.get('/books/add', function(req, res) {
        Category.find({}, function(err, categories){
            if (err) {
                console.log(err);
            } else {
                var model = {
                    categories: categories
                };

                res.render('manage/books/add', model);
            }
        });
    });

    router.post('/books', function(req, res) {
        var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var description = req.body.description && req.body.description.trim();
        var cover = req.body.cover && req.body.cover.trim();
        
        if (title == '' || price == '') {
            req.flash('error', 'Please fill out required fields');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        if (isNaN(price)) {
            req.flash('error', 'Price mush be a number');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        var newBook = {
            title: title,
            category: category,
            description: description,
            author: author,
            publisher: publisher,
            cover: cover,
            price: price
        };

        Book.insert(newBook).then((book) => {
            req.flash('success', 'Book added');
            res.location('/manage/books');
            res.redirect('/manage/books');
        }).catch((err) => {
            console.log('save error', err);
        });

    });

    router.get('/books/edit/:id', function(req, res) {
        Category.find({}, function(err, categories){
            Book.findOne({_id: req.params.id}, function(err, book) {
                if (err) {
                    console.log(err);
                } else {
                    var model = {
                        book: book,
                        categories: categories
                    };
                    res.render('manage/books/edit', model);
                }
            });
        });
    });

    router.post('/books/edit/:id', function(req, res) {
        var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var description = req.body.description && req.body.description.trim();
        var cover = req.body.cover && req.body.cover.trim();
        
        if (title == '' || price == '') {
            req.flash('error', 'Please fill out required fields');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        if (isNaN(price)) {
            req.flash('error', 'Price mush be a number');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        var newBook = {
            title: title,
            category: category,
            description: description,
            author: author,
            publisher: publisher,
            cover: cover,
            price: price
        };

        Book.update({_id: req.params.id}, newBook).then((book) => {
            req.flash('success', 'Book updated');
            res.location('/manage/books');
            res.redirect('/manage/books');
        }).catch((err) => {
            console.log('update error', err);
        });

    });


    router.delete('/books/delete/:id', function (req, res) {
        Book.remove({_id: req.params.id}, function(err){
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Book deleted');
                res.location('/manage/books');
                res.redirect('/manage/books');
            }
        });
    });

    router.get('/categories/add', function(req, res) {
        res.render('manage/categories/add');
    });

    router.post('/categories', function(req, res) {
        var name = req.body.name && req.body.name.trim();
        if (name == '') {
            req.flash("error", "Please fill out the required field");
            res.location('/manage/categories/add');
            res.redirect('/manage/categories/add');
        } else {
            var newCat = {
                name: name
            };

            Category.insert(newCat).then((category) => {
                req.flash('success', 'Category added');
                res.location('/manage/categories');
                res.redirect('/manage/categories');
            }).catch((err) => {
                console.log('save error', err);
            });
        }
    });

    router.get('/categories/edit/:id', function(req, res) {
        Category.findOne({_id: req.params.id}, function(err, category) {
            if (err) {
                console.log(err);
            } else {
                var model = {
                    category: category
                };
                res.render('manage/categories/edit', model);
            }
        });
    });

    router.post('/categories/edit/:id', function(req, res) {
        var name = req.body.name && req.body.name.trim();
        var newCat = {
            name: name
        };

        Category.update({_id: req.params.id}, newCat).then((category) => {
            req.flash('success', 'Category updated');
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        }).catch((err) => {
            console.log('update error', err);
        });

    });

    router.delete('/categories/delete/:id', function (req, res) {
        Category.remove({_id: req.params.id}).then(() => {
            req.flash('success', 'Category deleted');
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        }).catch((err) => {
            console.log(err);
        });
    });


};
