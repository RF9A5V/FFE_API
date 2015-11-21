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
  var item = new Item(req.body);
  item.save(function(err){
    if (err){
      return res.send(err)
    }
    res.send({message: 'Item created!'})
  })
})

router.get('/:id', function(req, res, next){
  Item.findOne({ _id: req.params.id }, function(err, item){
    if(err) res.send(err)
    console.log(req.params.id)
    User.findOne({ _id: item.owner }, function(err, user){
      if(err) res.send(err)
      console.log(item.owner)
      console.log(user)
      res.render('items/show', {
        item: item,
        owner: owner
      })
    })
  })
})
