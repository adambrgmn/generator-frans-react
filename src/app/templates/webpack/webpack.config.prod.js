const url = require('url');
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const { homepage } = require('../package');
const PATHS = require('./paths');
const {
  getClientEnvironment,
  ensureSlash,
} = require('./utils');

const homepagePathname = homepage ? url.parse(homepage).pathname : '/';
const publicPath = ensureSlash(homepagePathname, true);
const publicUrl = ensureSlash(homepagePathname, false);
const staticDir = 'static';
const env = getClientEnvironment(publicUrl);

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    PATHS.appPolyfills,
    PATHS.appIndexJs,
  ],
  output: {
    path: PATHS.appBuild,
    filename: path.join(staticDir, 'js', '[name].[chunkhash:8].js'),
    chunkFilename: path.join(staticDir, 'js', '[name].[chunkhash:8].chunk.js'),
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
        include: PATHS.appSrc,
        loader: 'babel',
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&-autoprefixer!postcss!resolve-url!sass?sourceMap' // eslint-disable-line max-len
        ),
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
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin(env),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    new ExtractTextPlugin(path.join(staticDir, 'css', '[name].[contenthash:8].css')),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
