'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stations_log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      station_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      station_version: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING(64)
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      altitude: {
        type: Sequelize.INTEGER
      },
      street_name: {
        type: Sequelize.STRING(1024)
      },
      street_number: {
        type: Sequelize.STRING(1024)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.dropTable('stations_log')
  ])
};
