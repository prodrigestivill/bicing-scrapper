'use strict';

const config = require('../config');
const path = require('path');
const Sequelize = require('sequelize');
const seqImport = require('sequelize-import');

const seq = new Sequelize(config.db.url, config.db.opts);

const models = seqImport(path.join(__dirname, '..', 'models'), seq, {});

Object.keys(models).forEach(m => {
  const model = models[m];
  if (model.associate) model.associate(models);
});

const utils = {
  needsUpdate: async (key, updated, transaction) => {
    const value = updated.toISOString();
    const [ instance, wasCreated ] = await models.value.findOrCreate({
      where: { key },
      defaults: {
        key,
        value
      },
      transaction
    });
    const ret = (wasCreated || instance.value !== value);
    if (instance.value !== value) {
      instance.value = value;
      await instance.save({ transaction });
    }
    return ret;
  }
};

module.exports = { seq, models, op: Sequelize.Op, utils };
