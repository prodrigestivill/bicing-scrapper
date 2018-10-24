'use strict';

module.exports = (sequelize, DataTypes) => {
  var data = sequelize.define('data', {
    station_id: DataTypes.STRING,
    station_version: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    slots: DataTypes.INTEGER,
    bikes: DataTypes.INTEGER,
    nearby_stations: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true
  });
  data.associate = (models) => {
    data.belongsTo(models.station, {
      foreignKey: 'station_id',
      targetKey: 'id'
    });
  };
  return data;
};
