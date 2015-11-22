var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Session = mongoose.model('Session'),
  hasher = require('password-hash'),
  crypto = require('crypto');

module.exports = function (app) {
  app.use('/login', router);
};

router.get('/', function(req, res, next){
  res.render('sessions/new')
})

router.post('/', function(req, res, next){
  var email = req.body.email,
      password = req.body.password;

  User.findOne({email: email}, function(err, user){
    if(err) res.send(err);
    if(user == null){
      res.send("Couldn't log you in!");
    }
    else if(!hasher.verify(password, user.password)){
      res.send('Wrong password!')
    }
    else{
      req.session.cookie.user_id = user._id;
      req.session.save(function(err){
        console.log(req.session)
        res.json(user);
      })
    }

  })
})
