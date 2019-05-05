'use strict';

module.exports = {
  apps: [
    {
      name: 'bicing-scrapper',
      script: 'lib/index.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1
    }
  ]
};
