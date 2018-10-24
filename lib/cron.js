'use strict';

const fetch = require('./utils/fetch');
const config = require('./config');
const constants = require('./utils/constants');
const process_stations = require('./process/stations');
const process_data = require('./process/data');
const model = require('../utils/db').models.value;

let cron_interval;

const self = module.exports = {
  run: async () => {
    try {
      const json = await fetch(constants.stations_url);
      const updated = new Date(json.updateTime * 1000);
      const key = 'last_updated';
      const [ instance, wasCreated ] = await model.findOrCreate({
        where: { key },
        defaults: {
          key,
          value: updated.toISOString()
        }
      });
      if (wasCreated || instance.value !== updated.toISOString()) {
        const stations = await process_stations(json.stations, updated);
        await process_data(stations, json.stations, updated);
      }
    } catch (ex) {
      console.log(ex);
    }
  },
  start: async () => {
    if (cron_interval) clearInterval(cron_interval);
    await self.run();
    cron_interval = setInterval(() => self.run(), config.update_interval);
  },
  stop: async () => {
    clearInterval(cron_interval);
  }
};
