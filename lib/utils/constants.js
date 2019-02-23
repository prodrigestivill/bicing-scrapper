'use strict';

module.exports = {
  url: {
    stations: 'https://www.bicing.barcelona/get-stations',
    referer: 'https://www.bicing.barcelona/mapa-de-disponibilitat-provisional',
    origin: 'https://www.bicing.barcelona'
  },
  user_agent: 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J700M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Mobile Safari/537.36',
  csv_attributes: {
    data: [
      'timestamp',
      'slots',
      'bikes',
      'status',
      'station_version',
      'electrical_bikes',
      'mechanical_bikes'
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
