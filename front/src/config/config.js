let config;

if (process.env.NODE_ENV === 'development') {
  config = require('./config.dev.js');
} else {
  config = require('./config.prod');
}

module.exports = config;
