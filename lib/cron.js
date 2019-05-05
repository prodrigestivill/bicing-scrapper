'use strict';

const fetch = require('./utils/fetch');
const config = require('./config');
const constants = require('./utils/constants');
const process_stations = require('./process/stations');
const process_data = require('./process/data');
const dump_db = require('./process/dump');

let cron_timeout = null;
let cron_times = 0;

const run_stations = async () => {
  console.log(`Fetching stations info...`);
  const json = await fetch(constants.url.stations);
  const updated = new Date(json.last_updated * 1000);
  return await process_stations(json.data.stations, updated, json.ttl);
};

const run_data = async () => {
  console.log(`Fetching stations status...`);
  const json = await fetch(constants.url.use);
  const updated = new Date(json.last_updated * 1000);
  return await process_data(json.data.stations, updated, json.ttl);
};

const self = module.exports = {
  run: async (s, d) => {
    try {
      const needs_stations = s !== false ? await run_stations() : false;
      const needs_data = d !== false ? await run_data() : false;
      if (config.dump_extra === 'always') {
        await dump_db(needs_stations, needs_data);
      }
    } catch (ex) {
      console.error(ex);
    }
  },
  _runTimeout: async () => {
    let s = false;
    cron_times++;
    if (cron_times >= config.update_stations_each) {
      s = true;
      cron_times = 0;
    }
    await self.run(s, true);
    if (cron_timeout !== null) {
      cron_timeout = setTimeout(self._runTimeout, config.update_interval);
    }
  },
  start: () => {
    if (cron_timeout) clearTimeout(cron_timeout);
    cron_timeout = true;
    cron_times = 0;
    self._runTimeout();
  },
  stop: () => {
    clearTimeout(cron_timeout);
    cron_timeout = null;
  }
};
