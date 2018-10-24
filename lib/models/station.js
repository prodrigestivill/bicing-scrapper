'use strict';

module.exports = (sequelize, DataTypes) => {
  var station = sequelize.define('station', {
    version: DataTypes.INTEGER,
    type: DataTypes.STRING(64),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    altitude: DataTypes.INTEGER,
    street_name: DataTypes.STRING(1024),
    street_number: DataTypes.STRING(1024)
  }, {
    timestamps: true,
    underscored: true
  });
  station.associate = (models) => {
    station.hasMany(models.data, {
      foreignKey: 'station_id',
      sourceKey: 'id'
    });
  };
  return station;
};
