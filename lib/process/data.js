'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const fs_mkdir = util.promisify(fs.mkdir);
const stringify = require('csv-stringify');
const config = require('../config');
const constants = require('../utils/constants');
const data_model = require('../utils/db').models.data;

const parseNearbyStations = (val) => (
  val ? val.replace(/\s/, '') : ''
);

const insert_data_csv = (station, values, ts, p) => new Promise((resolve, reject) => {
  const fn = path.join(p, `data_station_${station.id}.csv`);
  const outstream = fs.createWriteStream(fn, {
    flags: 'a',
    encoding: 'utf8',
    autoClose: true
  });
  outstream.on('finish', resolve);
  outstream.on('error', reject);
  const stringifier = stringify(constants.csv_opts);
  stringifier.pipe(outstream);
  stringifier.write([
    // CSV columns in order: no headers coz we use append so document carefully
    ts,
    parseInt(values.slots),
    parseInt(values.bikes),
    values.status,
    station.version,
    parseNearbyStations(values.nearbyStations)
  ]);
  stringifier.end();
});

const insert_data_sql = async (station, values, ts, p) => {
  await data_model.create({
    station_id: station.id,
    station_version: station.version,
    timestamp: ts,
    slots: parseInt(values.slots),
    bikes: parseInt(values.bikes),
    status: values.status,
    nearby_stations: parseNearbyStations(values.nearbyStations).split(',')
  });
};

module.exports = async (stations, data, updated) => {
  let p, insert;
  if (config.save_data_as !== 'sql') {
    p = path.join(config.out_path, `${updated.toISOString().substring(0, 7)}`);
    await fs_mkdir(p, { recursive: true });
  }
  switch (config.save_data_as) {
    case 'csv':
      insert = insert_data_csv;
      break;
    case 'sql':
      insert = insert_data_sql;
      break;
    default:
      throw new Error('Invalid save_data_as config');
  }
  for (const obj of data) {
    const station = stations[obj.id];
    try {
      await insert(station, obj, updated, p);
    } catch (ex) {
      console.log('Error processing station data:', obj, ex);
    }
  }
};
