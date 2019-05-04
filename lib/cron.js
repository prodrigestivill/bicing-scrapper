'use strict';

const fetch = require('./utils/fetch');
const config = require('./config');
const constants = require('./utils/constants');
const process_stations = require('./process/stations');
const process_data = require('./process/data');
const dump_db = require('./process/dump');

let cron_interval, cron_stations_interval;

const run_stations = async () => {
  console.log(`Fetching stations info...`);
  const json = await fetch(constants.url.stations);
  const updated = new Date(json.last_updated * 1000);
  return await process_stations(json.data.stations, updated);
};

const run_data = async () => {
  console.log(`Fetching stations status...`);
  const json = await fetch(constants.url.use);
  const updated = new Date(json.last_updated * 1000);
  return await process_data(json.data.stations, updated);
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
  start: async () => {
    if (cron_interval) clearInterval(cron_interval);
    if (cron_stations_interval) clearInterval(cron_stations_interval);
    await self.run(true, true);
    cron_interval = setInterval(() => self.run(false, true), config.update_interval);
    cron_stations_interval = setInterval(() => self.run(true, false), config.update_stations_interval);
  },
  stop: async () => {
    clearInterval(cron_interval);
    clearInterval(cron_stations_interval);
  }
};
