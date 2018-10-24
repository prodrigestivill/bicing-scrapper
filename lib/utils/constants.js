'use strict';

module.exports = {
  url: {
    stations: 'http://wservice.viabicing.cat/v2/stations',
    use: 'https://www.bicing.cat/current-bikes-in-use.json'
  },
  csv_attributes: {
    data: [
      'timestamp',
      'slots',
      'bikes',
      'status',
      'station_version',
      'nearby_stations'
    ],
    station: false,
    station_log: { exclude: ['id'] }
  },
  csv_opts: { // CSV Options from: https://csv.js.org/stringify/options/
    delimiter: ';',
    quote: '"',
    quoted: false, // quote all the non-empty fields even if not required
    quotedString: true, // quote all fields of type string even if not required
    // String used to delimit record rows or a special value;
    //   special values are 'unix', 'mac', 'windows', 'ascii', 'unicode'
    rowDelimiter: 'unix',
    formatters: {
      boolean: (val) => (val ? 't' : 'f'),
      date: (val) => val.toISOString(), // YYYY-MM-DDTHH:mm:ss.sssZ
      object: (val) => Array.isArray(val) ? val.join(',') : JSON.stringify(val)
    },
    header: false // keep to false coz we use append file
  }
};
