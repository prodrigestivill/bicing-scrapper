'use strict';

const db = require('../db');
const data_model = db.models.data;

module.exports = {
  insert: async (values, transaction) => {
    await data_model.create(values, { transaction });
  },
  hasEntry: async (station_id, timestamp, transaction) => {
    return await data_model.count({
      where: {
        station_id,
        timestamp
      },
      transaction
    }) > 0;
  }
};
