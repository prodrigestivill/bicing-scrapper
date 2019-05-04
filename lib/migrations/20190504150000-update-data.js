'use strict';
const q = {
  up: table => `UPDATE ${table} SET
  name = (id || ' - ' || street_name || ', ' || street_number),
  type = REPLACE(type, 'BIKE-ELECTRIC', 'ELECTRICBIKESTATION'),
  address = (street_name || ', ' || street_number)
  `,
  down: table => `UPDATE ${table} SET
  type = REPLACE(type, 'ELECTRICBIKESTATION', 'BIKE-ELECTRIC'),
  street_name = (address || ' (' || postal_code, ')')
  `
};
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(q.up('stations')),
    queryInterface.sequelize.query(q.up('stations_log'))
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(q.down('stations')),
    queryInterface.sequelize.query(q.down('stations_log'))
  ])
};
