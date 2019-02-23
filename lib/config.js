'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

const out_path = process.env.OUTPUT_PATH || path.join(__dirname, '..', 'data');
const default_url = `sqlite://${path.join(out_path, 'database.sqlite')}`;
mkdirp.sync(out_path);

module.exports = {
  out_path,
  update_interval: parseInt(process.env.UPDATE_INTERVAL) || 60000,
  agent_keepalive: parseInt(process.env.AGENT_KEEPALIVE) || 120000,
  save_data_as: process.env.SAVE_DATA_AS || 'csv', // or sql
  dump_extra: process.env.DUMP_EXTRA || 'never', // or never
  db: {
    url: process.env.DATABASE_URL || default_url,
    opts: {
      timezone: '+00:00',
      pool: { max: 2, min: 0, acquire: 30000, idle: 10000 },
      operatorsAliases: false,
      logging: false
    }
  }
};
