var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  hasher = require('password-hash');

module.exports = function (app) {
  app.use('/users', router);
};

router.get('/', function(req, res, next){
  User.find(function(err, users){
    if(err){
      res.send(err);
    }
    res.json(users);
  })
});

router.get('/wishlist/:id', function(req, res, next) {
  User.findOne({'_id': req.params.id}, function(err,user) {
      if (err) res.send(err);
      if (user == null) res.json({ status: "error", message: "User with ID does not exist" });
      else {
        res.json(user.wishlist);
      }
  });
});

router.post('/wishlist/add/:id', function(req, res, next) {
  User.findOne({'_id': req.params.id}, function(err,user) {
      if (err) res.send(err);
      if (user == null) res.json({ status: "error", message: "User with ID does not exist" });
      else {
        user.wishlist.push(req.body.data);
        user.save(function(err){
          if (err){
            console.log(err)
            return res.send(err)
          }
          res.json({status: "success", message: "Successfully added item to wishlist!"});
        });
      }
  });
});

router.post('/wishlist/remove/:id', function(req, res, next) {
  User.findOne({'_id': req.params.id}, function(err,user) {
    if (err) res.send(err);
    if (user == null) res.json({ status: "error", message: "User with ID does not exist" });
    else {
      var i = user.wishlist.indexOf(req.body.data);
      if(i != -1) {
        res.json({ status: "error", message: "This item does not exist in wishlist"});
      }
      else {
        user.wishlist.splice(i, 1, 0);
        user.save(function(err){
          if (err) {
            console.log(err);
            return res.send(err);
          }
          res.json({status: "success", message: "Successfully removed item from wishlist!"});
        });
      }
    }
  });
});

router.get('/validate', function(req, res, next){
  console.log(req.session.uid);
  res.json({uid:req.session.uid});
});

router.get('/new', function(req, res, next){
  res.render('users/new')
});

router.post('/create', function(req, res, next){
  var user = new User(req.body);
  user.password = hasher.generate(user.password);
  user.wishlist = [];
  user.save(function(err){
    if(err){
      return res.send(err);
    }
    res.send({ status: "success", message: 'New user created', uid: user._id })
  })
})

router.get('/:id', function (req, res, next) {
  res.render('users/show', {
    id: req.params.id
  });
});
