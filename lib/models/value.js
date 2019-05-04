'use strict';

module.exports = (sequelize, DataTypes) => {
  var value = sequelize.define('value', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return value;
};
