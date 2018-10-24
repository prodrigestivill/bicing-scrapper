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

module.exports = { seq, models, op: Sequelize.Op };
