'use strict';

module.exports = {
  url: {
    stations: 'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_information',
    use: 'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status'
  },
  csv_attributes_version: { // For CSV without header
    data: 2
  },
  csv_attributes: {
    data: [
      'timestamp',
      'station_version',
      'slots',
      'bikes_mechanical',
      'bikes_electric',
      'service',
      'charging',
      'renting',
      'returning'
    ],
    station: false,
    station_log: { exclude: ['id'] }
  },
  csv_opts: { // CSV Options from: https://csv.js.org/stringify/options/
    delimiter: ';',
    quote: '"',
    quoted: false, // quote all the non-empty fields even if not required
    quotedString: true, // quote all fields of type string even if not required
    rowDelimiter: '\n', // string used to delimit record rows, don't use special values
    formatters: {
      boolean: (val) => (val ? 't' : 'f'),
      date: (val) => val.toISOString(), // YYYY-MM-DDTHH:mm:ss.sssZ
      object: (val) => Array.isArray(val) ? val.join(',') : JSON.stringify(val)
    },
    header: false // keep to false coz we use append file
  }
};
