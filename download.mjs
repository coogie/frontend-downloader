import fs from 'fs';
import https from 'https';
import mkdirp from 'mkdirp';
import path from 'path';

import { blue, green } from './utils';

let iteration = 0;
let mutableModulesArray = [];

const download = ({ modules, directory }) => {
  if (modules.length === 0) {
    green('Nothing left to download');
    process.exit(0);
  }

  if (iteration === 0) {
    mutableModulesArray = modules;
    mkdirp.sync(directory);
  }

  const { title, src } = mutableModulesArray.shift();
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

          download({
            modules: mutableModulesArray,
            directory,
          });
        });
    })
  })
};

export default download;