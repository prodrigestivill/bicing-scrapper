'use strict';

const path = require('path');
const mkdirP = require('util').promisify(require('mkdirp'));
const config = require('../config');
const data_utils = require('../utils/data');
const db = require('../utils/db');
const station_model = db.models.station;

module.exports = async (data, updated, ttl) => {
  const transaction = await db.seq.transaction();
  const needs = await db.utils.needsUpdate('last_data_updated', updated, transaction);
  let count = 0;
  if (needs) {
    console.log('Processing all station data...', updated, ttl);
    let p = transaction;
    if (config.save_data_as !== 'sql') {
      p = path.join(config.out_path, `${updated.toISOString().substring(0, 7)}`);
      await mkdirP(p);
    }
    for (const obj of data) {
      try {
        const station = await station_model.findByPk(obj.station_id, { paranoid: false, transaction });
        const timestamp = new Date(obj.last_reported * 1000);
        if (!station || station.last_reported === null ||
          station.last_reported.getTime() !== timestamp.getTime() ||
          !await data_utils.hasEntry(obj.station_id, timestamp, p)) {
          await data_utils.insert({
            station_id: obj.station_id,
            station_version: station ? station.version : null,
            timestamp,
            slots: obj.num_docks_available,
            bikes: obj.num_bikes_available,
            bikes_mechanical: obj.num_bikes_available_types ? obj.num_bikes_available_types.mechanical : null,
            bikes_electric: obj.num_bikes_available_types ? obj.num_bikes_available_types.ebike : null,
            status: obj.status,
            service: obj.status === 'IN_SERVICE',
            installed: !!obj.is_installed,
            renting: !!obj.is_renting,
            returning: !!obj.is_returning,
            charging: !!obj.is_charging_station
          }, p);
          count++;
          if (station) {
            station.last_reported = timestamp;
            await station.save({ transaction });
          }
        }
      } catch (ex) {
        console.error('Error processing station data:', obj, ex);
      }
    }
  }
  if (!needs || !count) {
    console.log(`No new station data.`);
  }
  transaction.commit();
  return needs && count;
};
