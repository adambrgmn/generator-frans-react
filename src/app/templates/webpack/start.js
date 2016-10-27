process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = process.env.NODE_ENV;

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const historyApiFallback = require('connect-history-api-fallback');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const { logMessage } = require('./utils');
const config = require('./webpack.config.dev');
const PATHS = require('./paths');

if (!checkRequiredFiles([PATHS.appHtml, PATHS.appIndexJs])) {
  process.exit(1);
}

const DEFAULT_PORT = process.env.PORT || 3000;

const setupCompiler = ({ host, port, protocol }) => new Promise((resolve) => {
  const compiler = webpack(config);

  compiler.plugin('invalid', () => {
    clearConsole();
    logMessage(chalk.yellow('Compiling...'));
  });

  compiler.plugin('done', (stats) => {
    clearConsole();
    const { errors, warnings } = formatWebpackMessages(stats.toJson({}, true));

    if (errors.length) {
      logMessage(chalk.red('Failed to compile.'));
      errors.forEach(logMessage);
      return;
    }

    if (warnings.length) {
      logMessage(chalk.yellow('Compiled with warnings.'));
      warnings.forEach(logMessage);
      return;
    }

    logMessage(chalk.green('Compiled successfully!'));
    logMessage('The app is running at:');
    logMessage(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`);
    logMessage(
      'Note that the development build is not optimized.',
      `To create a production build, run ${chalk.cyan('npm run build')}.`
    );
  });

  return resolve(compiler);
});

const setupDevServer = ({ host, protocol }) => (compiler) => new Promise((resolve) => {
  const devServer = new WebpackDevServer(compiler, {
    clientLogLevel: 'none',
    contentBase: PATHS.appPublic,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: { ignored: /node_modules/ },
    https: protocol === 'https',
    host,
  });

  return resolve(devServer);
});

const applyMiddleware = (devServer) => new Promise((resolve) => {
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: ['text/html', '*/*'],
  }));

  devServer.use(devServer.middleware);

  return resolve(devServer);
});

const runDevServer = ({ port }) => (devServer) => new Promise((resolve, reject) => {
  devServer.listen(port, (err) => {
    if (err) return reject(err);

    clearConsole();
    return logMessage(chalk.cyan('Starting development server...'));
  });
});

const run = () => {
  const settings = {
    host: process.env.HOST || 'localhost',
    port: DEFAULT_PORT,
    protocol: process.env.HTTPS === 'true' ? 'https' : 'http',
  };

  return setupCompiler(settings)
    .then(setupDevServer(settings))
    .then(applyMiddleware)
    .then(runDevServer(settings));
};

run();
