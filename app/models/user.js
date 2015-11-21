// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  telephone: String,
  owned_items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UserSchema);
