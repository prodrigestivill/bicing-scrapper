'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('data', 'bikes_mechanical', { type: Sequelize.INTEGER }),
    queryInterface.addColumn('data', 'bikes_electric', { type: Sequelize.INTEGER }),
    queryInterface.addColumn('data', 'status', { type: Sequelize.STRING(32) }),
    queryInterface.addColumn('data', 'installed', { type: Sequelize.BOOLEAN }),
    queryInterface.addColumn('data', 'renting', { type: Sequelize.BOOLEAN }),
    queryInterface.addColumn('data', 'returning', { type: Sequelize.BOOLEAN }),
    queryInterface.addColumn('data', 'charging', { type: Sequelize.BOOLEAN }),
    queryInterface.addColumn('stations', 'name', { type: Sequelize.STRING(1024) }),
    queryInterface.addColumn('stations', 'address', { type: Sequelize.STRING(2048) }),
    queryInterface.addColumn('stations', 'postal_code', { type: Sequelize.STRING(32) }),
    queryInterface.addColumn('stations', 'capacity', { type: Sequelize.INTEGER }),
    queryInterface.addColumn('stations', 'last_reported', { type: Sequelize.DATE }),
    queryInterface.addColumn('stations', 'deleted_at', { type: Sequelize.DATE }),
    queryInterface.addColumn('stations_log', 'name', { type: Sequelize.STRING(1024) }),
    queryInterface.addColumn('stations_log', 'address', { type: Sequelize.STRING(2048) }),
    queryInterface.addColumn('stations_log', 'postal_code', { type: Sequelize.STRING(32) }),
    queryInterface.addColumn('stations_log', 'capacity', { type: Sequelize.INTEGER }),
    queryInterface.addColumn('stations_log', 'deleted_at', { type: Sequelize.DATE })
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('data', 'bikes_mechanical'),
    queryInterface.removeColumn('data', 'bikes_electric'),
    queryInterface.removeColumn('data', 'status'),
    queryInterface.removeColumn('data', 'installed'),
    queryInterface.removeColumn('data', 'renting'),
    queryInterface.removeColumn('data', 'returning'),
    queryInterface.removeColumn('data', 'charging'),
    queryInterface.removeColumn('stations', 'name'),
    queryInterface.removeColumn('stations', 'address'),
    queryInterface.removeColumn('stations', 'postal_code'),
    queryInterface.removeColumn('stations', 'capacity'),
    queryInterface.removeColumn('stations', 'last_reported'),
    queryInterface.removeColumn('stations', 'deleted_at'),
    queryInterface.removeColumn('stations_log', 'name'),
    queryInterface.removeColumn('stations_log', 'address'),
    queryInterface.removeColumn('stations_log', 'postal_code'),
    queryInterface.removeColumn('stations_log', 'capacity'),
    queryInterface.removeColumn('stations_log', 'deleted_at')
  ])
};
