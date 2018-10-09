if (process.env.LAMBDA) process.env.BABEL_DISABLE_CACHE=1;

require('babel-runtime/core-js/promise').default = require('bluebird');
require('babel-core/register');
module.exports = require('./app.js');