var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SessionSchema = new Schema({
  session_hash: String,
  user_id: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

SessionSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Session', SessionSchema);
