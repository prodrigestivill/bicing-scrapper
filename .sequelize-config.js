'use strict';

const config = require('./lib/config');

const cfg = {
  url: config.db.url,
  ...config.db.opts
};

module.exports = {
  production: cfg,
  development: cfg,
  test: cfg
};
