import 'dotenv/config';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import path from 'path';
import { scraper } from './scraper';

const log = message => console.log(chalk.blue(message));
const err = message => console.log(chalk.red(message));

(async () => {
  const {
    FRONTEND_MASTERS_USER,
    FRONTEND_MASTERS_PASS,
    FRONTEND_MASTERS_COURSE,
    FRONTEND_MASTERS_DIR,
  } = process.env;

  if (!FRONTEND_MASTERS_USER || !FRONTEND_MASTERS_PASS || !FRONTEND_MASTERS_COURSE) {
    err('ERROR');
    err('Environment variables not set!');
    log('');
    log('Please make sure to set the following in a .env file:');
    log('  FRONTEND_MASTERS_USER');
    log('  FRONTEND_MASTERS_PASS');
    log('  FRONTEND_MASTERS_COURSE');
    log('  FRONTEND_MASTERS_DIR  (optional)');
    log('');

    throw Error('Environment variables not set');
  }

  const config = {
    username: FRONTEND_MASTERS_USER.toString(),
    password: FRONTEND_MASTERS_PASS.toString(),
    targetCourse: FRONTEND_MASTERS_COURSE,
    directory: FRONTEND_MASTERS_DIR || 'downloads',
  };

  const saveDir = path.join(process.cwd(), config.directory);
  mkdirp.sync(saveDir);

  await scraper(config);
})();
