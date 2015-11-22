var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/items', router);
};

router.get('/', function (req, res, next) {
  Item.find(function(err, items){
    if(err){
      return res.send(err);
    }
    console.log(req.session)
    res.json(items)

  })
});

router.get('/new', function(req, res, next){

  res.render('items/new')
})

router.post('/create', function(req, res, next){

  if(req.session.user == undefined) {
    console.log(req.session)
    res.send("It busted")
  }
  else {
    var item = new Item(req.body);
    item.owner = req.session.user._id
    item.save(function(err){
      if (err){
        return res.send(err)
      }
      res.send({message: 'Item created!'})
    })
  }
})

router.get('/:id', function(req, res, next){
  Item.findOne({ '_id': req.params.id }, function(err, item){
    if(err) res.send(err)
    User.findOne({ '_id': item.owner }, function(err, user){
      if(err) res.send(err)
      res.render('items/show', {
        item: item,
        owner: owner
      })
    })
  })
})
