'use strict';

module.exports = {
  apps: [
    {
      name: 'bicing-scrapper',
      script: 'lib/index.js',
      instances: 1,
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=8192',
      env_production: {
        DEBUG: 'bicing:*',
        NODE_ENV: 'production'
      }
    }
  ]
};
