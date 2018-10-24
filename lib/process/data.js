'use strict';

const fs = require('fs');
const path = require('path');
const mkdirP = require('util').promisify(require('mkdirp'));
const stringify = require('csv-stringify');
const config = require('../config');
const constants = require('../utils/constants');
const data_model = require('../utils/db').models.data;

const insert_data = {
  sql: async (station, values, p) => {
    await data_model.create(values);
  },
  csv: (station, values, p) => new Promise((resolve, reject) => {
    const fn = path.join(p, `data_station_${encodeURIComponent(station.id)}.csv`);
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

module.exports = async (stations, data, updated) => {
  const insert = insert_data[config.save_data_as];
  let p;
  if (config.save_data_as !== 'sql') {
    p = path.join(config.out_path, `${updated.toISOString().substring(0, 7)}`);
    await mkdirP(p);
  }
  for (const obj of data) {
    try {
      const station = stations[obj.id];
      const values = {
        station_id: station.id,
        station_version: station.version,
        timestamp: updated,
        slots: parseInt(obj.slots),
        bikes: parseInt(obj.bikes),
        status: obj.status,
        nearby_stations: obj.nearbyStations ? obj.nearbyStations.replace(/\s/g, '').split(',') : []
      };
      await insert(station, values, p);
    } catch (ex) {
      console.log('Error processing station data:', obj, ex);
    }
  }
};
