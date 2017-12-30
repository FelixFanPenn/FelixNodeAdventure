'use strict';

var mongoURI = require('../config/keys').mongoURI;
var db = require('monk')(mongoURI);
var Book = db.get('books');
var Category = db.get('categories');

module.exports = function (router) {
    router.get('/', function (req, res) {
      //get cart from session
      var cart = req.session.cart;
      var displayCart = {items: [], total: 0};
      var total = 0;

      //get total
      for (var item in cart) {
        displayCart.items.push(cart[item]);
        total += (cart[item].qty * cart[item].price);
      }

      displayCart.total = total;

      //render Cart
      res.render('cart/index', {
        cart: displayCart
      });
    });

    router.post('/:id', function (req, res) {
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;

        Book.findOne({_id:req.params.id}, function(err, book){
          if (err) {
            console.log(err);
          }
          if (cart[req.params.id]) {
            cart[req.params.id].qty++;
            cart[req.params.id].subprice += Number(cart[req.params.id].price);

          } else {
            cart[req.params.id] = {
              item: book._id,
              title: book.title,
              price: book.price,
              subprice: Number(book.price),
              qty: 1
            };
          }

          res.redirect('/cart');
        });
    });

};
