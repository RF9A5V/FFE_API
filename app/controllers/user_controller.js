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
    res.json(users)
  })
})

router.get('/new', function(req, res, next){
  res.render('users/new')
})

router.post('/create', function(req, res, next){
  var user = new User(req.body);
  user.password = hasher.generate(user.password);
  user.save(function(err){
    if(err){
      return res.send(err);
    }
    req.session.uid = user._id;
    res.send({ status: "success", message: 'New user created' })
  })
})

router.get('/:id', function (req, res, next) {
  res.render('users/show', {
    id: req.params.id
  });
});
