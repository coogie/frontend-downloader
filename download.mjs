import fs from 'fs';
import https from 'https';
import mkdirp from 'mkdirp';
import path from 'path';

import { blue, green, waitBetweenSeconds } from './utils';

let iteration = 0;
let mutableCurriculumArray = [];
let timerToTryFoolDetectionThatMightNotWork;

const download = ({ curriculum, directory }) => {
  if (curriculum.length === 0) {
    green('Nothing left to download');
    process.exit(0);
  }

  if (iteration === 0) {
    mutableCurriculumArray = curriculum;
    mkdirp.sync(directory);
  }

  const { title, src } = mutableCurriculumArray.shift();
  const dest = `${path.join(directory, title)}.mp4`;
  const tmpDest = `${dest}.tmp`;
  const file = fs.createWriteStream(tmpDest);

  file.on('open', () => {
    blue(`Downloading: ${title}`);
    https.get(src, req => {
      req
        .on('data', chunk => file.write(chunk))
        .on('finish', () => {
          file.end();
          green('Download complete!');
        })
        .on('end', () => {
          fs.renameSync(tmpDest, dest);

          const delay = waitBetweenSeconds(8, 12);
          blue(`Waiting ${delay} seconds`);    
          timerToTryFoolDetectionThatMightNotWork = setTimeout(() => {
            download({
              curriculum: mutableCurriculumArray,
              directory,
            });
          }, delay)
        });
    })
  })
};

export default download;