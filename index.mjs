import 'dotenv/config';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import path from 'path';

import scraper from './scraper';

export const red = message => console.log(chalk.red(message));
export const green = message => console.log(chalk.green(message));
export const blue = message => console.log(chalk.blue(message));

(async () => {
  const {
    FRONTEND_MASTERS_USER,
    FRONTEND_MASTERS_PASS,
    FRONTEND_MASTERS_COURSE,
    FRONTEND_MASTERS_DIR,
  } = process.env;

  if (!FRONTEND_MASTERS_USER || !FRONTEND_MASTERS_PASS || !FRONTEND_MASTERS_COURSE) {
    red('ERROR');
    red('Environment variables not set! \n');
    blue('Please make sure to set the following in a .env file:');
    blue('  FRONTEND_MASTERS_USER');
    blue('  FRONTEND_MASTERS_PASS');
    blue('  FRONTEND_MASTERS_COURSE');
    blue('  FRONTEND_MASTERS_DIR  (optional) \n');

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

  const videos = await scraper(config);

  console.log(videos);
})();
