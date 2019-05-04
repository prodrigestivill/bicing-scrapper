'use strict';

module.exports = (sequelize, DataTypes) => {
  var log = sequelize.define('station_log', {
    station_id: DataTypes.INTEGER,
    station_version: DataTypes.INTEGER,
    name: DataTypes.STRING(1024),
    type: DataTypes.STRING(64),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    altitude: DataTypes.INTEGER,
    address: DataTypes.STRING(2048),
    postal_code: DataTypes.STRING(16),
    capacity: DataTypes.INTEGER
  }, {
    tableName: 'stations_log',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  log.associate = (models) => {
    log.belongsTo(models.station, {
      foreignKey: 'station_id',
      targetKey: 'id'
    });
  };
  return log;
};
