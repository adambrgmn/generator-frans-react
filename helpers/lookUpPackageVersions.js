const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const devDeps = [
  'autoprefixer',
  'babel-cli',
  'babel-eslint',
  'babel-loader',
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-object-rest-spread',
  'babel-plugin-transform-react-jsx-self',
  'babel-plugin-transform-react-jsx-source',
  'babel-plugin-transform-regenerator',
  'babel-plugin-transform-runtime',
  'babel-preset-flow',
  'babel-preset-latest',
  'babel-preset-react',
  'babel-register',
  'babel-runtime',
  'blue-tape',
  'case-sensitive-paths-webpack-plugin',
  'chalk',
  'connect-history-api-fallback',
  'css-loader',
  'css-modules-require-hook',
  'enzyme',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-babel',
  'eslint-plugin-flowtype',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'extract-text-webpack-plugin',
  'file-loader',
  'filesize',
  'fs-extra',
  'gh-pages',
  'gzip-size',
  'html-webpack-plugin',
  'jsdom',
  'json-loader',
  'node-sass',
  'object-assign',
  'postcss-loader',
  'promise',
  'react-addons-test-utils',
  'react-dev-utils',
  'react-hot-loader',
  'recursive-readdir',
  'resolve-url-loader',
  'rimraf',
  'sass-loader',
  'strip-ansi',
  'style-loader',
  'stylelint',
  'stylelint-config-standard',
  'tap-spec',
  'tape',
  'url-loader',
  'webpack',
  'webpack-dev-server',
  'webpack-manifest-plugin',
  'whatwg-fetch',
];

const deps = [
  'react',
  'react-dom',
];

const mapFn = ((pkg) => new Promise((resolve, reject) => {
  const cp = spawn('npm', ['view', pkg, 'version']);
  let v;
  let e = '';
  cp.stdout.on('data', (data) => (v = data.toString().trim()));
  cp.stderr.on('data', (err) => (e += err.toString()));

  cp.on('close', () => {
    if (e) return reject(e);
    return resolve({
      pkg,
      version: v,
    });
  });
}));

const devDepsPromises = devDeps.sort().map(mapFn);
const depsPromises = deps.sort().map(mapFn);

Promise.all([...devDepsPromises, ...depsPromises])
  .then((result) => {
    const obj = result.reduce((prev, curr) => ({
      ...prev,
      [curr.pkg]: `^${curr.version}`,
    }), {});

    return obj;
  })
  .then((obj) => new Promise((resolve, reject) => {
    const newObj = Object.keys(obj).reduce((prev, curr) => {
      if (curr === 'react' || curr === 'react-dom') {
        prev.dependencies[curr] = obj[curr]; // eslint-disable-line no-param-reassign
      } else {
        prev.devDependencies[curr] = obj[curr]; // eslint-disable-line no-param-reassign
      }

      return prev;
    }, { dependencies: {}, devDependencies: {} });

    fs.writeFile(path.join(__dirname, '..', 'src/app/dependencies.json'), JSON.stringify(newObj, null, 2), (err) => {
      if (err) reject(err);
      console.log('Done!');
      resolve('done');
    });
  }))
  .catch((err) => {
    console.log('Error!');
    console.log(err);
  });
