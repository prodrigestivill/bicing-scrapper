'use strict';

const db = require('../utils/db');
const { station, station_log } = db.models;

module.exports = async (data, updated, ttl) => {
  const transaction = await db.seq.transaction();
  const needs = await db.utils.needsUpdate('last_updated', updated, transaction);
  if (needs) {
    console.log('Processing all station info...', updated, ttl);
    await station.destroy({ where: {}, paranoid: true, transaction });
    for (const obj of data) {
      try {
        const d = {
          id: obj.station_id,
          version: 1,
          name: obj.name,
          type: obj.physical_configuration,
          latitude: obj.lat,
          longitude: obj.lon,
          altitude: obj.altitude,
          address: obj.address,
          postal_code: obj.post_code,
          capacity: obj.capacity
        };
        const [ instance, wasCreated ] = await station.findOrCreate({
          where: { id: d.id },
          defaults: d,
          paranoid: false,
          transaction
        });
        let wasUpdated = false;
        if (!wasCreated) {
          delete d.version;
          if (instance.type !== d.type ||
            instance.latitude !== d.latitude ||
            instance.longitude !== d.longitude ||
            instance.altitude !== d.altitude) {
            instance.version++;
            wasUpdated = true;
          }
          Object.assign(instance, d);
          await instance.restore({ transaction }); // also saves all changes
        }
        if (wasCreated || wasUpdated) {
          await station_log.destroy({
            where: {
              station_id: d.id
            },
            transaction
          });
          await station_log.create({
            station_id: instance.id,
            station_version: instance.version,
            name: instance.name,
            type: instance.type,
            latitude: instance.latitude,
            longitude: instance.longitude,
            altitude: instance.altitude,
            address: instance.address,
            postal_code: instance.post_code,
            capacity: instance.capacity
          }, { transaction });
        }
      } catch (ex) {
        console.error('Error processing station:', obj);
        transaction.rollback();
        throw ex;
      }
    }
  } else {
    console.log(`No new station info.`);
  }
  transaction.commit();
  return needs;
};
