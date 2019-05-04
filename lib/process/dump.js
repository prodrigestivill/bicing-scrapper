'use strict';

const fs = require('fs');
const path = require('path');
const mkdirP = require('util').promisify(require('mkdirp'));
const stringify = require('csv-stringify');
const config = require('../config');
const constants = require('../utils/constants');
const db = require('../utils/db');
const { value, station, station_log } = db.models;
const data_model = db.models.data;

const use_raw = db.seq.getDialect() !== 'sqlite';
const map_fun = v => v.get({ plain: true });

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

const dump_csv = async (model, attributes, file) => {
  let data = await model.findAll({ raw: use_raw, attributes, paranoid: false });
  if (!use_raw) data = data.map(map_fun);
  await save_csv(data, file, { header: true });
};

const dump_stations = async (p, save_stations) => {
  let stations = await station.findAll({ raw: use_raw, attributes: constants.csv_attributes.station, paranoid: false });
  if (!use_raw) stations = stations.map(map_fun);
  if (save_stations) await save_csv(stations, path.join(p, 'stations.csv'), { header: true });
  for (const station of stations) {
    let data = await data_model.findAll({
      where: { station_id: station.id },
      attributes: constants.csv_attributes.data,
      paranoid: false,
      raw: use_raw
    });
    if (!use_raw) data = data.map(map_fun);
    await save_csv(data, path.join(p, `data_station_${encodeURIComponent(station.id)}_v${constants.csv_attributes_version.data}.csv`));
  }
};

module.exports = async (save_stations, save_data) => {
  switch (config.save_data_as) {
    case 'csv':
      if (save_stations) {
        console.log('Dumping current stations database...');
        const instance = await value.findOne({ where: { key: 'last_updated' } });
        const p = path.join(config.out_path, `${instance.value.substring(0, 7)}`);
        await mkdirP(p);
        await dump_csv(station, constants.csv_attributes.station, path.join(p, 'stations.csv'));
        await dump_csv(station_log, constants.csv_attributes.station_log, path.join(p, 'stations_log.csv'));
      }
      break;
    case 'sql':
      if (save_data || save_stations) {
        console.log('Dumping current database...');
        const p = path.join(config.out_path, 'sql_dump');
        await mkdirP(p);
        if (save_data) {
          await dump_stations(p, save_stations);
        } else if (save_stations) {
          await dump_csv(station, constants.csv_attributes.station, path.join(p, 'stations.csv'));
        }
        if (save_stations) {
          await dump_csv(station_log, constants.csv_attributes.station_log, path.join(p, 'stations_log.csv'));
        }
      }
      break;
    default:
      throw new Error('Invalid save_data_as config');
  }
};
