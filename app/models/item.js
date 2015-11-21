// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  description: String,
  location: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  category: Number,
  is_taken: Boolean,
  interested_count: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

ItemSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Item', ItemSchema);
