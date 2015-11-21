var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/tags', router);
};
