const { spawn } = require('child_process');

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
  'babel-preset-latest',
  'babel-preset-react',
  'babel-preset-react-hmre',
  'babel-register',
  'babel-runtime',
  'blue-tape',
  'chunk-manifest-webpack-plugin',
  'clean-webpack-plugin',
  'css-loader',
  'css-modules-require-hook',
  'enzyme',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-babel',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'extract-text-webpack-plugin',
  'file-loader',
  'gh-pages',
  'html-webpack-plugin',
  'image-webpack-loader',
  'inline-manifest-webpack-plugin',
  'jsdom',
  'json-loader',
  'node-sass',
  'object-assign',
  'postcss-loader',
  'promise',
  'react-addons-test-utils',
  'resolve-url-loader',
  'sass-loader',
  'style-loader',
  'stylelint',
  'stylelint-config-standard',
  'tap-spec',
  'tape',
  'url-loader',
  'webpack',
  'webpack-dev-server',
  'webpack-manifest-plugin',
  'webpack-md5-hash',
  'webpack-merge',
  'webpack-validator',
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
