'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const fs_mkdir = util.promisify(fs.mkdir);
const stringify = require('csv-stringify');
const config = require('../config');
const constants = require('../utils/constants');
const db = require('../utils/db');
const { value, station, station_log } = db.models;
const data_model = db.models.data;

const save_csv = (data, fn, csv_opts = {}) => new Promise((resolve, reject) => {
  const outstream = fs.createWriteStream(fn, {
    flags: 'w',
    encoding: 'utf8',
    autoClose: true
  });
  outstream.on('finish', resolve);
  outstream.on('error', reject);
  const opts = Object.assign({}, constants.csv_opts, csv_opts);
  const stringifier = stringify(data, opts);
  stringifier.pipe(outstream);
});

const dump_csv = async (model, file, attributes) => {
  const raw = db.seq.getDialect() !== 'sqlite';
  let data = await model.findAll({ raw, attributes });
  if (!raw) data = data.map(v => v.get());
  await save_csv(data, file, { header: true });
};

const dump_stations = async (p) => {
  const raw = db.seq.getDialect() !== 'sqlite';
  let stations = await station.findAll({ raw, attributes: constants.csv_attributes.station });
  if (!raw) stations = stations.map(v => v.get());
  await save_csv(stations, path.join(p, 'stations.csv'), { header: true });
  for (const station of stations) {
    let data = await data_model.findAll({
      where: { station_id: station.id },
      attributes: constants.csv_attributes.data,
      raw
    });
    if (!raw) data = data.map(v => v.get());
    await save_csv(data, path.join(p, `data_station_${station.id}.csv`));
  }
};

module.exports = async () => {
  switch (config.save_data_as) {
    case 'csv':
      const instance = await value.findOne({ where: { key: 'last_updated' } });
      const p = path.join(config.out_path, `${instance.value.substring(0, 7)}`);
      await fs_mkdir(p, { recursive: true });
      await dump_csv(station, path.join(p, 'stations.csv'), constants.csv_attributes.station);
      await dump_csv(station_log, path.join(p, 'stations_log.csv'), constants.csv_attributes.station_log);
      break;
    case 'sql':
      const p2 = path.join(config.out_path, 'sql_dump');
      await fs_mkdir(p2, { recursive: true });
      await dump_stations(p2);
      await dump_csv(station_log, path.join(p2, 'stations_log.csv'), constants.csv_attributes.station_log);
      break;
    default:
      throw new Error('Invalid save_data_as config');
  }
};
