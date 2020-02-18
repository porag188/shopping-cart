var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    var productChunk = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Express', products: productChunk });
  });
});
//route create
router.get('/user/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});
router.post(
  '/user/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/user/porfile',
    failureRedirect: '/user/signup',
    failureFlash: true
  })
);
router.get('/user/profile', function(req, res, next) {
  res.render('/user/profile');
});
// router.post('/user/signup', function(req, res, next) {
//   res.redirect('/');
// });
// router.post('/user/singup', (req, res, next) => {
//   res.redirect('/');
// });
module.exports = router;
