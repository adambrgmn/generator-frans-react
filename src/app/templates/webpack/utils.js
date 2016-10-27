const chalk = require('chalk');
const filesize = require('filesize');

exports.ensureSlash = (path, needsSlash) => {
  const hasSlash = path.endsWith('/');

  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  }

  return path;
};

exports.getClientEnvironment = (publicUrl) => {
  const REACT_APP = /^REACT_APP_/i;

  const processEnv = Object
    .keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => (
      Object.assign({}, env, {
        [key]: JSON.stringify(process.env[key]),
      })
    ), {
      NODE_ENV: JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      PUBLIC_URL: JSON.stringify(publicUrl),
    });

  return { 'process.env': processEnv };
};

exports.logMessage = (...messages) => {
  messages.forEach((message) => console.log(message));
  console.log();
};

exports.removeFileNameHash = (fileName, replace) => fileName
  .replace(replace, '')
  .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);

exports.getDifferenceLabel = (currentSize, previousSize) => {
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

  return chalk.dim(`±${fileSize}`);
};
