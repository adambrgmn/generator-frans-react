process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = process.env.NODE_ENV;

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const filesize = require('filesize');
const gzipSize = require('gzip-size').sync;
const rimrafSync = require('rimraf').sync;
const webpack = require('webpack');
const recursive = require('recursive-readdir');
const stripAnsi = require('strip-ansi');
const clearConsole = require('react-dev-utils/clearConsole');

const {
  removeFileNameHash,
  getDifferenceLabel,
  logMessage,
} = require('./utils');

const config = require('./webpack.config.prod');
const PATHS = require('./paths');

const getFileSizes = (stats, previousSizeMap) => {
  const assets = stats.toJson().assets
    .filter((asset) => /\.(js|css)$/.test(asset.name))
    .map((asset) => {
      const fileContents = fs.readFileSync(path.join(PATHS.appBuild, asset.name));
      const size = gzipSize(fileContents);
      const previousSize = previousSizeMap[removeFileNameHash(asset.name, PATHS.appBuild)];
      const diff = getDifferenceLabel(size, previousSize);

      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size,
        sizeLabel: filesize(size) + (diff ? ` (${diff})` : ''),
      };
    });

  assets.sort((a, b) => b.size - a.size);

  const longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );

  return assets.map(({ name, sizeLabel, folder }) => {
    let label = sizeLabel;
    const sizeLength = stripAnsi(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      label += rightPadding;
    }

    return `→  ${label}  ${chalk.dim(folder + path.sep)}${name}`;
  });
};

const printErrors = (summary, errors) => {
  logMessage(chalk.red(summary));
  errors.forEach((err) => logMessage(err.message || err));
};

const build = (previousSizeMap) => {
  clearConsole();
  logMessage(chalk.blue('Creating an optimized production build...'));
  webpack(config).run((err, stats) => {
    if (err) {
      printErrors('Failed to compile', [err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    clearConsole();
    logMessage(chalk.green('Compiled successfully.'));
    logMessage('File sizes after gzip:');
    logMessage(...getFileSizes(stats, previousSizeMap));
  });
};

const copyPublicFolder = () => {
  fs.copySync(PATHS.appPublic, PATHS.appBuild, {
    dereference: true,
    filter: (file) => file !== PATHS.appHtml,
  });
};

recursive(PATHS.appBuild, (err, fileNames) => {
  const previousSizeMap = (fileNames || [])
    .filter((fileName) => /\.(js|css)$/.test(fileName))
    .reduce((memo, fileName) => {
      const contents = fs.readFileSync(fileName);
      const key = removeFileNameHash(fileName, PATHS.appBuild);

      return Object.assign({}, memo, {
        [key]: gzipSize(contents),
      });
    }, {});

  rimrafSync(`${PATHS.appBuild}/*`);

  build(previousSizeMap);
  copyPublicFolder();
});
