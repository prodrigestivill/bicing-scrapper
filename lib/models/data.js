'use strict';

module.exports = (sequelize, DataTypes) => {
  var data = sequelize.define('data', {
    station_id: DataTypes.STRING,
    station_version: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    status: DataTypes.INTEGER,
    slots: DataTypes.INTEGER,
    bikes: DataTypes.INTEGER,
    electrical_bikes: DataTypes.INTEGER,
    mechanical_bikes: DataTypes.INTEGER
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
