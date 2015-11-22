var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  hasher = require('password-hash'),
  crypto = require('crypto');

module.exports = function (app) {
  app.use('/login', router);
};

router.get('/', function(req, res, next){
  if(req.session.uid != undefined){
    res.json({ status: "error", message: "You are already logged in!" })
    next();
  }
  res.render('sessions/new')
})

router.get('/list', function (req, res, next) {
  Session.find(function(err, sessions){
    if(err){
      return res.send(err);
    }
    res.json(sessions);
  });
});

router.post('/', function(req, res, next){
  var email = req.body.email,
      password = req.body.password;

    console.log("Email: " + email + 'password' + password);

  if(req.session.uid != undefined){
    console.log("You are already logged in!");
    res.json({ status: "error", message: "You are already logged in!" })
    next();
  }

  User.findOne({email: email}, function(err, user){
    if(err) res.send(err);
    if(user == null){
      console.log("Couldn't log you in!");
      return res.send("Couldn't log you in!");
    }
    else if(!hasher.verify(password, user.password)){
      console.log('Wrong password!');
      return res.send('Wrong password!')
    }
    else{
      console.log('Session saved!');
      req.session.uid = user._id;
      console.log(user._id);
      console.log(req.session)
      return res.json(user);
    }

  })
})

router.post('/destroy', function(req, res, next){
  req.session.uid = undefined;
  res.json({ status: "success", message: "Successfully logged out" })
})
