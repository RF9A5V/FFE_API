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
    res.json(items)

  })
});

router.get('/new', function(req, res, next){

  res.render('items/new')
})

router.post('/create', function(req, res, next){

  console.log(req.session);

  if(req.session.uid == undefined) {
    console.log("Session info: [undefined]" + req.session)
    res.json({error: "You are not logged in.", status: "error"})
  }
  else {
    var item = new Item(req.body);
    item.owner = req.session.uid
    item.save(function(err){
      if (err){
        return res.send(err)
      }
      res.json({status: "success", message: "Successfully created item!"})
    })
  }
})

router.get('/:id', function(req, res, next){
  Item.findOne({ '_id': req.params.id }, function(err, item){
    if(err) res.send(err)
    if(item == null){
      res.json({ status: "error", message: "Item with ID does not exist" })
    }
    User.findOne({ '_id': item.owner }, function(err, user){
      if(err) res.send(err)
      res.json({
        item: item,
        owner: user
      })
    })
  })
})
