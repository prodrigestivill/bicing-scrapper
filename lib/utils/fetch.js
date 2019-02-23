'use strict';

const config = require('../config');
const constants = require('./constants');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');

http.globalAgent = new http.Agent({ keepAlive: true, keepAliveMsecs: config.agent_keepalive });
https.globalAgent = new https.Agent({ keepAlive: true, keepAliveMsecs: config.agent_keepalive });

module.exports = async (url, origin, referer) => {
  const headers = {
    'User-Agent': constants.user_agent
  };
  // TODO add a cookie jar
  if (origin) headers['Origin'] = origin;
  if (referer) headers['Referer'] = referer;
  const res = await fetch(url, { method: 'GET', headers });
  if (!res.ok) {
    console.error(res);
    throw new Error('Error retrieved from server');
  }
  const json = await res.json();
  // TODO should we use only local time or use date headers
  const updated_str = res.headers.get('date');
  let updated;
  if (updated_str) {
    updated = new Date(updated_str);
  } else {
    updated = new Date();
    updated.setUTCMilliseconds(0);
  }
  const age_str = res.headers.get('age');
  if (age_str) {
    updated = new Date(updated.getTime() - (parseInt(age_str) * 1000));
  }
  // Warn for cookie while not cookie jar
  const setcookie = res.headers.get('set-cookie');
  if (setcookie) console.log(`WARN: new cookie not handled "${setcookie}"`);
  //
  return { json, updated };
};
