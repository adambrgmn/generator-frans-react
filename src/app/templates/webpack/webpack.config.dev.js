const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const { getClientEnvironment } = require('./utils');
const PATHS = require('./paths');

const publicPath = '/';
const publicUrl = '';
const staticDir = 'static';
const env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('react-hot-loader/patch'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    PATHS.appPolyfills,
    PATHS.appIndexJs,
  ],
  output: {
    path: PATHS.appBuild,
    pathinfo: true,
    filename: path.join(staticDir, 'js', 'bundle.js'),
    publicPath,
  },
  resolve: {
    fallback: PATHS.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: PATHS.appSrc,
        query: { cacheDirectory: true },
      },
      {
        test: /\.(scss|css)$/,
        loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss!resolve-url?sourceMap!sass?sourceMap',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: path.join(staticDir, 'media', '[name].[hash:8].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: path.join(staticDir, 'media', '[name].[hash:8].[ext]'),
        },
      },
    ],
  },
  postcss: () => [autoprefixer({
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9',
    ],
  })],
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: PATHS.appHtml,
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(PATHS.appNodeModules),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
