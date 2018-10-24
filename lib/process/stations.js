'use strict';

const db = require('../utils/db');
const { station, station_log } = db.models;

module.exports = async (data, updated) => {
  const stations = {};
  for (const obj of data) {
    try {
      const d = {
        id: parseInt(obj.id),
        version: 1,
        type: obj.type,
        latitude: parseFloat(obj.latitude),
        longitude: parseFloat(obj.longitude),
        altitude: parseInt(obj.altitude),
        street_name: obj.streetName,
        street_number: obj.streetNumber
      };
      const transaction = await db.seq.transaction();
      try {
        const [ instance, wasCreated ] = await station.findOrCreate({
          where: { id: d.id },
          defaults: d,
          transaction
        });
        let wasUpdated = false;
        if (!wasCreated && (
          instance.type !== d.type ||
          instance.latitude !== d.latitude ||
          instance.longitude !== d.longitude ||
          instance.altitude !== d.altitude
        )) {
          d.version = instance.version + 1;
          Object.assign(instance, d);
          await instance.save({ transaction });
          wasUpdated = true;
        }
        if (wasCreated || wasUpdated) {
          await station_log.create({
            station_id: d.id,
            station_version: d.version,
            type: d.type,
            latitude: d.latitude,
            longitude: d.longitude,
            altitude: d.altitude,
            street_name: d.street_name,
            street_number: d.street_number
          }, { transaction });
        }
        stations[d.id] = instance;
        transaction.commit();
      } catch (ex) {
        transaction.rollback();
        throw ex;
      }
    } catch (ex) {
      console.log('Error processing station:', obj);
    }
  }
  return stations;
};
