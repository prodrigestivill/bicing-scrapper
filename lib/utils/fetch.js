'use strict';

const config = require('../config');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');

http.globalAgent = new http.Agent({ keepAlive: true, keepAliveMsecs: config.agent_keepalive });
https.globalAgent = new https.Agent({ keepAlive: true, keepAliveMsecs: config.agent_keepalive });

module.exports = async (url) => {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    console.log(res);
    throw new Error('Error retrieved from server');
  }
  return await res.json();
};
