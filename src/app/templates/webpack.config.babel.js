import merge from 'webpack-merge';
import validate from 'webpack-validator';

import * as parts from './webpack/parts';
import PATHS from './webpack/paths';

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;

process.env.BABEL_ENV = TARGET;

const common = merge(
  {
    entry: {
      app: [PATHS.polyfills, PATHS.app],
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: {
        'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
      },
    },
  },
  parts.indexTemplate({
    title: '<%= appname %>',
    appMountId: 'root',
    template: PATHS.html,
  }),
  parts.loadJSX(PATHS.app),
  parts.loadFavicon(PATHS.favicon),
  parts.loadJSON(PATHS.app)
);

let config;

switch (TARGET) {
  case 'build':
  case 'build:stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.loadImagesBuild(PATHS.app),
      parts.clean(PATHS.build),
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react', 'react-dom'],
      }),
      parts.minify(),
      parts.extractCSS(PATHS.app),
      parts.setupProduction()
    );

    break;

  default:
    config = merge(
      common,
      { devtool: 'eval-source-map' },
      parts.setupCSS([PATHS.app, PATHS.nodeModules]),
      parts.loadImagesDev(PATHS.app),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
        poll: ENABLE_POLLING,
      })
    );
}

export default validate(config, { quiet: true });
