import 'dotenv/config';
import mkdirp from 'mkdirp';
import path from 'path';

import scraper from './scraper';
import download from './download';
import { red, blue } from './utils';

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
    directory: FRONTEND_MASTERS_DIR || `${path.join(process.cwd(), 'downloads')}`,
  };

  const downloadDirectory = path.join(config.directory, config.targetCourse);
  mkdirp.sync(downloadDirectory);

  const curriculum = await scraper(config);
 
  download({
    curriculum,
    directory: downloadDirectory,
  });
})();
