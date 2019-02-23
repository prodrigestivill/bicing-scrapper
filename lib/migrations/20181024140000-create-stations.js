'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING(64)
      },
      type_bicing: {
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
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
    queryInterface.dropTable('stations')
  ])
};
