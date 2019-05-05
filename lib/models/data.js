'use strict';

module.exports = (sequelize, DataTypes) => {
  var data = sequelize.define('data', {
    station_id: DataTypes.INTEGER,
    station_version: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    slots: DataTypes.INTEGER,
    bikes: DataTypes.INTEGER,
    bikes_mechanical: DataTypes.INTEGER,
    bikes_electric: DataTypes.INTEGER,
    status: DataTypes.STRING(32),
    service: DataTypes.BOOLEAN,
    installed: DataTypes.BOOLEAN,
    renting: DataTypes.BOOLEAN,
    returning: DataTypes.BOOLEAN,
    charging: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  data.associate = (models) => {
    data.belongsTo(models.station, {
      foreignKey: 'station_id',
      targetKey: 'id'
    });
  };
  return data;
};
