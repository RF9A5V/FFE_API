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
    db: "mongodb://addy:password@candidate.56.mongolayer.com:10543,candidate.55.mongolayer.com:10582/fe-app?replicaSet=set-5651c4e5354ad9bd78000a22"
  }
};

module.exports = config[env];
