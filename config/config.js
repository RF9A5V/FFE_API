var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ffe-api'
    },
    port: 1337,
    db: 'mongodb://localhost/ffe-api-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ffe-api'
    },
    port: 1337,
    db: 'mongodb://localhost/ffe-api-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ffe-api'
    },
    port: 1337,
    db: 'mongodb://localhost/ffe-api-production'
  }
};

module.exports = config[env];
