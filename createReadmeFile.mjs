import fs from 'fs';
import path from 'path';

import { green, red } from './utils';

const chunk = input => {
  const output = [];
  const len = 80;
  let curr = len;
  let prev = 0;
  
  while (input[curr]) {
    if (input[curr++] == ' ') {
      output.push(input.substring(prev,curr));
      prev = curr;
      curr += len;
    }
  }
  output.push(input.substr(prev));

  return output.join('\n');
};

const createReadmeFile = ({ destination, title, author, description, published }) => {
  const file = path.join(destination, '_README.md');

  const contents = `# ${title}

_Author: **${author}**,_  
_${published}_

${chunk(description)}
`;

  fs.writeFile(file, contents, err => {
    if (err) {
      red('There was an error generating the README');
      red(err);
    }

    green('README generated.');
  }); 
}

export default createReadmeFile;