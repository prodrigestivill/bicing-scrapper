'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('data', 'nearby_stations'),
    queryInterface.removeColumn('stations', 'street_name'),
    queryInterface.removeColumn('stations', 'street_number'),
    queryInterface.removeColumn('stations_log', 'street_name'),
    queryInterface.removeColumn('stations_log', 'street_number')
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('data', 'nearby_stations', { type: Sequelize.ARRAY(Sequelize.INTEGER) }),
    queryInterface.addColumn('stations', 'street_name', { type: Sequelize.STRING(1024) }),
    queryInterface.addColumn('stations', 'street_number', { type: Sequelize.STRING(1024) }),
    queryInterface.addColumn('stations_log', 'street_name', { type: Sequelize.STRING(1024) }),
    queryInterface.addColumn('stations_log', 'street_number', { type: Sequelize.STRING(1024) })
  ])
};
