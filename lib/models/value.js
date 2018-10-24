'use strict';

module.exports = (sequelize, DataTypes) => {
  var value = sequelize.define('value', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    timestamps: true,
    underscored: true
  });
  return value;
};
