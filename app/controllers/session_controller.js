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
  if(req.session.uid != undefined){
    res.json({ status: "error", message: "You are already logged in!" })
    next();
  }
  res.render('sessions/new')
})

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
      res.send("Couldn't log you in!");
    }
    else if(!hasher.verify(password, user.password)){
      console.log('Wrong password!');
      res.send('Wrong password!')
    }
    else{
      console.log('Session saved!');
      req.session.uid = user._id;
      console.log(user._id);
      console.log(req.session)
      req.session.save(function(err){
        console.log(req.session)
        res.json(user);

      })
    }

  })
})

router.get('/destroy', function(req, res, next){
  req.session.uid = undefined;
  res.json({ status: "success", message: "Successfully logged out" })
})
