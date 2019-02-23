'use strict';

console.log(`Loading...`);

const cron = require('./cron');

cron.start();

// Exit gracefully
process.on('SIGINT', async () => {
  await cron.stop();
  process.exit(0);
});
