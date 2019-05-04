'use strict';

const fs = require('fs');
const path = require('path');
const mkdirP = require('util').promisify(require('mkdirp'));
const stringify = require('csv-stringify');
const config = require('../config');
const constants = require('../utils/constants');
const db = require('../utils/db');
const station_model = db.models.station;
const data_model = db.models.data;

const insert_data = {
  sql: async (values, p) => {
    await data_model.create(values);
  },
  csv: (values, p) => new Promise((resolve, reject) => {
    const fn = path.join(p, `data_station_${encodeURIComponent(values.station_id)}_v${constants.csv_attributes_version.data}.csv`);
    const outstream = fs.createWriteStream(fn, {
      flags: 'a',
      encoding: 'utf8',
      autoClose: true
    });
    outstream.on('finish', resolve);
    outstream.on('error', reject);
    const stringifier = stringify(constants.csv_opts);
    stringifier.pipe(outstream);
    const arr = [];
    for (const key of constants.csv_attributes.data) {
      arr.push(key in values ? values[key] : null);
    }
    stringifier.write(arr);
    stringifier.end();
  })
};

module.exports = async (data, updated) => {
  const insert = insert_data[config.save_data_as];
  const transaction = await db.seq.transaction();
  const needs = await db.utils.needsUpdate('last_data_updated', updated, transaction);
  let count = 0;
  if (needs) {
    console.log(`Processing all station data...`);
    let p;
    if (config.save_data_as !== 'sql') {
      p = path.join(config.out_path, `${updated.toISOString().substring(0, 7)}`);
      await mkdirP(p);
    }
    for (const obj of data) {
      try {
        const station = await station_model.findByPk(obj.station_id, { paranoid: false, transaction });
        const timestamp = new Date(obj.last_reported * 1000);
        if (!station || station.last_reported !== timestamp) {
          const values = {
            station_id: obj.station_id,
            station_version: station ? station.version : null,
            timestamp,
            slots: obj.num_docks_available,
            bikes: obj.num_bikes_available,
            bikes_mechanical: obj.num_bikes_available_types ? obj.num_bikes_available_types.mechanical : null,
            bikes_electric: obj.num_bikes_available_types ? obj.num_bikes_available_types.ebike : null,
            status: obj.status,
            installed: !!obj.is_installed,
            renting: !!obj.is_renting,
            returning: !!obj.is_returning,
            charging: !!obj.is_charging_station
          };
          await insert(values, p);
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
