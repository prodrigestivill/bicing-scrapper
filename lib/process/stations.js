'use strict';

const db = require('../utils/db');
const { station, station_log } = db.models;

module.exports = async (data, updated) => {
  const stations = {};
  const transaction = await db.seq.transaction();
  for (const obj of data) {
    try {
      const d = {
        id: obj.id,
        version: 1,
        type: obj.type,
        type_bicing: parseInt(obj.type_bicing),
        latitude: parseFloat(obj.latitude),
        longitude: parseFloat(obj.longitude),
        street_name: obj.streetName,
        street_number: obj.streetNumber
      };
      const [ instance, wasCreated ] = await station.findOrCreate({
        where: { id: d.id },
        defaults: d,
        transaction
      });
      let wasUpdated = false;
      if (!wasCreated && (
        instance.type !== d.type ||
        instance.type_bicing !== d.type_bicing ||
        instance.latitude !== d.latitude ||
        instance.longitude !== d.longitude
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
          type_bicing: d.type_bicing,
          latitude: d.latitude,
          longitude: d.longitude,
          street_name: d.street_name,
          street_number: d.street_number
        }, { transaction });
      }
      stations[d.id] = instance;
    } catch (ex) {
      console.error('Error processing station:', obj);
      transaction.rollback();
      throw ex;
    }
  }
  transaction.commit();
  return stations;
};
