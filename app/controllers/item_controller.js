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
    return res.json({error: "You are not logged in.", status: "error"})
  }
  else {
    User.findOne({'_id': req.session.uid}, function(err,user) {
      if (err) res.send(err);
      if (user == null) res.json({ status: "error", message: "This user does not exist" });
      else {
        var item = new Item(req.body);
        item.owner = req.session.uid;
        item.created_time = Date.now();
        item.updated_time = Date.now();
        item.save(function(err){
          if (err){
            console.log(err)
            return res.send(err)
          }
          res.json({status: "success", message: "Successfully created item!"})
        });

        (user.owned_items).push(item._id);
        console.log(user);
        user.save();
      }
      return res.json({status: "success", message: "Successfully created item!"})
    })
  }
})

router.post('/edit/:id', function(req, res, next){
  console.log(req.session);

  if(req.session.uid == undefined) {
    console.log("Session info: [undefined]" + req.session)
    res.json({error: "You are not logged in.", status: "error"})
  }
  else {
    Item.findOne({'_id': req.params.id}, function(err,item) {
      if (err) res.send(err);
      if (item == null) res.json({ status: "error", message: "Item with ID does not exist" });
      else {
        item.title = req.body.title;
        item.description = req.body.description;
        item.location = req.body.location;
        item.category = req.body.category;
        item.is_taken = req.body.is_taken;
        item.tags = req.body.tags;
        item.updated_time = Date.now();

        item.save(function(err){
          if (err){
            console.log(err)
            return res.send(err)
          }
          res.json({status: "success", message: "Successfully updated item!"});
        });
      }
    });
  }
});

router.get('/:id', function(req, res, next){
  Item.findOne({ '_id': req.params.id }, function(err, item){
    if(err) return res.send(err)
    if(item == null){
      return res.json({ status: "error", message: "Item with ID does not exist" })
    }
    User.findOne({ '_id': item.owner }, function(err, user){
      if(err) res.send(err)
      return res.json({
        item: item,
        owner: user
      })
    })
  })
})

router.get('/my_listings/:id', function(req, res, next){
  Item.find({ 'owner': req.params.id }, function(err, listings){
    if(err) res.send(err)
    if(listings == null){
      res.json({ status: "error", message: "This user does not have any listing" });
    }
    else {
      res.json(listings);
    }
  });
})

router.post('/:id/like', function(req, res, next){
  if(req.session.uid == undefined){
    return res.json({ status: "error", message: "You need to be logged into like things." })
    next();
  }

  Item.findOne({ '_id': req.params.id }).populate("interested_count").exec(function(err, item){
    if(err) return res.send(err)
    if(item == null){
      return res.json({ status: "error", message: "Item with ID does not exist" })
      next();
      return;
    }
    removed = false;
    for(var i = 0; i < item.interested_count.length; i ++){
      if(item.interested_count[i]._id == req.session.uid){
        item.interested_count.splice(i, 1);
        item.save(function(err){
          removed = true;
          return res.json({status: "success", message: "Didn't break", item: item})
          return res.end();
        })
      }
    }
    if(!removed){
      User.findOne({ "_id": req.session.uid }, function(err, user){
        if(err) return res.json({status:"error", message: err})
        item.interested_count.push(user)
        item.save(function(err) {
          return res.json({status: "success", message: "Didn't break", item: item})
          return res.end();
        })
      })
    }
  })
})

router.delete('/:id/delete/', function(req, res, next){
  Item.findByIdAndRemove(req.params.id, function(err, item){
    if(err) return res.send(err);
    if(item == null) return res.send("Item doesn't exist")
    User.findById(item.owner, function(err, user){
      index = user.owned_items.indexOf(item._id);
      if(index >= 0){
        user.owned_items = user.owned_items.splice(index, 1);
        user.save();
      }
    })
    return res.json({status: "success", message: "Successfully deleted item."});
  })
})
