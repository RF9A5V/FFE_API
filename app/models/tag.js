// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TagSchema = new Schema({
  content: String
});

TagSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Tag', TagSchema);
