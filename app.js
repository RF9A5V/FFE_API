var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  cfenv = require('cfenv');

appEnv = cfenv.getAppEnv();
instance = appEnv.app.instance_index || 0



mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config, mongoose);

var port = appEnv.port;

app.listen(port, function () {
  console.log('Express server listening on port ' + appEnv.url);
});
