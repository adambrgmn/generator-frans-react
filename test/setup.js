/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');

const babelrc = fs.readFileSync(path.join(process.cwd(), '.babelrc'));
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('Error parsing .babelrc');
  console.error(err);
}

require('babel-register')(config);
