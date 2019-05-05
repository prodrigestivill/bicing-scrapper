'use strict';

const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify');
const constants = require('../constants');

const getFile = (station_id, p) => path.join(p, `data_station_${encodeURIComponent(station_id)}_v${constants.csv_attributes_version.data}.csv`);

module.exports = {
  insert: (values, p) => new Promise((resolve, reject) => {
    const fn = getFile(values.station_id, p);
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
  }),
  hasEntry: (station_id, timestamp, p) => new Promise((resolve, reject) => {
    let ret = false;
    const value = constants.csv_opts.formatters.date(timestamp);
    const fn = getFile(station_id, p);
    const instream = fs.createReadStream(fn, {
      encoding: 'utf8',
      autoClose: true
    });
    let last_str;
    const d = (str) => {
      const arr = str.split(constants.csv_opts.rowDelimiter);
      if (last_str) arr[0] = last_str + arr[0];
      last_str = arr.pop();
      for (const line of arr) {
        if (line && line.startsWith(value)) {
          ret = true;
          return instream.destroy();
        }
      }
    };
    const f = () => resolve(ret);
    instream.on('data', d);
    instream.on('error', f);
    instream.on('close', f);
  })
};
