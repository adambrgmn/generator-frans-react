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

const config = require('./webpack.config.prod');
const PATHS = require('./paths');

const removeFileNameHash = (fileName) => fileName
    .replace(PATHS.appBuild, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);

const getDifferenceLabel = (currentSize, previousSize) => {
  const FIFTY_KB = 1024 * 50;
  const diff = currentSize - previousSize;
  const fileSize = !Number.isNaN(diff) ? filesize(diff) : 0;

  if (diff >= FIFTY_KB) {
    return chalk.red(`+${fileSize}`);
  } else if (diff < FIFTY_KB && diff > 0) {
    return chalk.yellow(`+${fileSize}`);
  } else if (diff < 0) {
    return chalk.green(fileSize);
  }

  return '';
};

const printFileSizes = (stats, previousSizeMap) => {
  const assets = stats.toJson().assets
    .filter((asset) => /\.(js|css)$/.test(asset.name))
    .map((asset) => {
      const fileContents = fs.readFileSync(`${PATHS.appBuild}/${asset.name}`);
      const size = gzipSize(fileContents);
      const previousSize = previousSizeMap[removeFileNameHash(asset.name)];
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

  assets.forEach(({ name, sizeLabel, folder }) => {
    let label = sizeLabel;
    const sizeLength = stripAnsi(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      label += rightPadding;
    }

    console.log(
      `  ${label}  ${chalk.dim(folder + path.sep)}${name}`
    );
  });
};

const printErrors = (summary, errors) => {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach((err) => {
    console.log(err.message || err);
    console.log();
  });
};

const build = (previousSizeMap) => {
  console.log('Creating an optimized production build...');
  webpack(config).run((err, stats) => {
    if (err) {
      printErrors('Failed to compile', [err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    console.log('File sizes after gzip:');
    console.log();
    printFileSizes(stats, previousSizeMap);
    console.log();
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
      const key = removeFileNameHash(fileName);

      return Object.assign({}, memo, {
        [key]: gzipSize(contents),
      });
    }, {});

  rimrafSync(`${PATHS.appBuild}/*`);

  build(previousSizeMap);
  copyPublicFolder();
});
