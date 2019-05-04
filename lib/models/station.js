'use strict';

module.exports = (sequelize, DataTypes) => {
  var station = sequelize.define('station', {
    version: DataTypes.INTEGER,
    name: DataTypes.STRING(1024),
    type: DataTypes.STRING(64),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    altitude: DataTypes.INTEGER,
    address: DataTypes.STRING(2048),
    postal_code: DataTypes.STRING(32),
    capacity: DataTypes.INTEGER,
    last_reported: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  station.associate = (models) => {
    station.hasMany(models.data, {
      foreignKey: 'station_id',
      sourceKey: 'id'
    });
  };
  return station;
};
