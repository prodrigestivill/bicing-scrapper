# bicing scrapper

Supports to save data in:
  - CSV files (append)
  - PostgreSQL database
  - MySQL database

The configuration works using environment variables.

## Prepare
Install dependencies, create database and run once:
```sh
npm install
npm run migrate
npm run once
```

Run foreground:
```sh
npm start
```

## Configuration parameters
 * `OUTPUT_PATH`: Output path for dumping database.
 * `UPDATE_INTERVAL`: Interval in ms to run the cron job.
 * `AGENT_KEEPALIVE`: Time to keep connection alive to the servers.
 * `SAVE_DATA_AS`: save data into the database or as a CSV file.
 * `DUMP_EXTRA`: if `always` dumps all data every time the cron job finishes.
 * `DATABASE_URL`: URL to the database, by default uses sqlite file inside `OUTPUT_PATH`.

It's important to define it before executing `npm run migrate` in order to populate the database with the proper tables.

### Configuration example
```sh
export OUTPUT_PATH="/tmp/bicing/"
export UPDATE_INTERVAL="40000" #ms
export AGENT_KEEPALIVE="120000" #ms
export SAVE_DATA_AS="csv"
export DUMP_EXTRA="always"
export DATABASE_URL="mysql://user:pass@example.com:9821/db_name"
```

## Dump all data
```sh
npm run dump
```

## Setup to start on boot

```sh
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup -u "$USER" --hp "$HOME"
```

### Automatic monthly archive
To archive any old CSV generated each first day of month at 18:00 am local time, run after exporting the config:
```sh
pm2 start scripts/archive.sh -c "0 0 18 1 * *"
```

Or run `crontab -e` and add:
```
0 18 1 * * PATH_TO_PROJECT/scripts/archive.sh
```
Remember to setup the crontab to load your environment variables correctly before running the script.

### Update configuration
After exporting the new config:
```sh
pm2 startOrRestart ecosystem.config.js --update-env
pm2 save
```

Keep in mind to also `update-env` for `scripts/archive.sh` if it has been added.
