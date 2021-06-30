'use strict';

module.exports = {
  apps: [
    {
      name: 'bicing-scrapper',
      script: 'lib/index.js',
      log_date_format: 'DD HH:mm:ss',
      exec_mode: 'fork',
      instances: 1
    }
  ]
};
