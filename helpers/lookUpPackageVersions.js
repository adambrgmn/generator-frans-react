const { spawn } = require('child_process');

const devDeps = [
  'webpack-merge',
  'webpack-validator',
  'babel-runtime',
  'babel-cli',
  'babel-register',
  'webpack',
  'webpack-dev-server',
  'clean-webpack-plugin',
  'extract-text-webpack-plugin',
  'html-webpack-plugin',
  'autoprefixer',
  'babel-loader',
  'url-loader',
  'image-webpack-loader',
  'file-loader',
  'json-loader',
  'style-loader',
  'css-loader',
  'postcss-loader',
  'resolve-url-loader',
  'sass-loader',
  'node-sass',
  'babel-preset-latest',
  'babel-preset-react',
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-object-rest-spread',
  'babel-plugin-transform-regenerator',
  'babel-plugin-transform-runtime',
  'babel-preset-react-hmre',
  'babel-plugin-transform-react-jsx-source',
  'babel-plugin-transform-react-jsx-self',
  'babel-eslint',
  'eslint-config-airbnb',
  'eslint-plugin-babel',
  'eslint',
  'eslint-plugin-import',
  'eslint-plugin-react',
  'eslint-plugin-jsx-a11y',
  'blue-tape',
  'tape-watch',
  'tap-spec',
  'enzyme',
  'jsdom',
  'css-modules-require-hook',
  'gh-pages',
  'stylelint',
  'stylelint-config-standard',
];

const deps = [
  'react',
  'react-dom',
];

const mapFn = ((pkg) => {
  return new Promise((resolve, reject) => {
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
  });
});

const devDepsPromises = devDeps.sort().map(mapFn);
const depsPromises = deps.sort().map(mapFn);

Promise.all(devDepsPromises)
  .then((result) => {
    const obj = result.reduce((prev, curr) => ({
      ...prev,
      [curr.pkg]: `^${curr.version}`,
    }), {});

    console.log('devDependencies');
    console.log(obj);
  })
  .catch((err) => {
    console.log('Error!');
    console.log(err);
  });

  Promise.all(depsPromises)
    .then((result) => {
      const obj = result.reduce((prev, curr) => ({
        ...prev,
        [curr.pkg]: `^${curr.version}`,
      }), {});

      console.log('dependencies');
      console.log(obj);
    })
    .catch((err) => {
      console.log('Error!');
      console.log(err);
    });
