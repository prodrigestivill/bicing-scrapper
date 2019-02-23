'use strict';

const fetch = require('./utils/fetch');
const config = require('./config');
const constants = require('./utils/constants');
const process_stations = require('./process/stations');
const process_data = require('./process/data');
const dump_db = require('./process/dump');
const model = require('./utils/db').models.value;

let cron_interval;

const needsUpdate = async (updated) => {
  const key = 'last_updated';
  const value = updated.toISOString();
  const [ instance, wasCreated ] = await model.findOrCreate({
    where: { key },
    defaults: {
      key,
      value
    }
  });
  const ret = (wasCreated || instance.value !== value);
  if (instance.value !== value) {
    instance.value = value;
    await instance.save();
  }
  return ret;
};

const process_all = async (data, updated) => {
  const stations = await process_stations(data, updated);
  await process_data(stations, data, updated);
};

const self = module.exports = {
  run: async () => {
    try {
      console.log(`Fetching data...`);
      const { updated, json } = await fetch(
        constants.url.stations,
        constants.url.origin,
        constants.url.referer
      );
      console.log(`Fetched data from ${updated}`);
      if (await needsUpdate(updated)) {
        console.log(`Saving all station data...`);
        await process_all(json.stations, updated);
        if (config.dump_extra === 'always') {
          console.log('Dumping current database...');
          await dump_db();
        }
        console.log(`Done.`);
      } else {
        console.log(`No new data.`);
      }
    } catch (ex) {
      console.error(ex);
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
