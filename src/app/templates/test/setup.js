require('../webpack/polyfills');
const fs = require('fs');
const path = require('path');
const hook = require('css-modules-require-hook');
const { renderSync } = require('node-sass');

const babelrc = fs.readFileSync(path.join(process.cwd(), '.babelrc'));
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('Error parsing .babelrc');
  console.error(err);
}

require('babel-register')(config);

global.document = require('jsdom').jsdom('<body></body>'); // eslint-disable-line import/newline-after-import
global.window = document.defaultView;
global.navigator = window.navigator;

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  extensions: ['.scss', '.css'],
  preprocessCss: (data, filename) => (
    renderSync({
      data,
      file: filename,
    }).css
  ),
});
