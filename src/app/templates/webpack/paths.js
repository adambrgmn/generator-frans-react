import { resolve } from 'path';

export default {
  app: resolve('app/index.js'),
  build: resolve('build'),
  html: resolve('webpack/index.ejs'),
  favicon: resolve('static/favicon.ico'),
  package: resolve('package.json'),
  nodeModules: resolve('node_modules'),
  polyfills: resolve('webpack/polyfills'),
};