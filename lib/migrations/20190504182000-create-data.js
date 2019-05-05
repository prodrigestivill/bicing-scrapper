'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('data', {
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
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      slots: {
        type: Sequelize.INTEGER
      },
      bikes: {
        type: Sequelize.INTEGER
      },
      bikes_mechanical: {
        type: Sequelize.INTEGER
      },
      bikes_electric: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING(32)
      },
      service: {
        type: Sequelize.BOOLEAN
      },
      installed: {
        type: Sequelize.BOOLEAN
      },
      renting: {
        type: Sequelize.BOOLEAN
      },
      returning: {
        type: Sequelize.BOOLEAN
      },
      charging: {
        type: Sequelize.BOOLEAN
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
    queryInterface.dropTable('data')
  ])
};
