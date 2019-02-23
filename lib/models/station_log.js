'use strict';

module.exports = (sequelize, DataTypes) => {
  var log = sequelize.define('station_log', {
    station_id: DataTypes.INTEGER,
    station_version: DataTypes.INTEGER,
    type: DataTypes.STRING(64),
    type_bicing: DataTypes.INTEGER,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    street_name: DataTypes.STRING(1024),
    street_number: DataTypes.STRING(1024)
  }, {
    tableName: 'stations_log',
    timestamps: true,
    underscored: true
  });
  log.associate = (models) => {
    log.belongsTo(models.station, {
      foreignKey: 'station_id',
      targetKey: 'id'
    });
  };
  return log;
};
