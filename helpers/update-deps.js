const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {
  dependencies,
  devDependencies,
} = require('../src/app/templates/package');


const mapTpPromise = ((pkg) => new Promise((resolve, reject) => {
  const cp = spawn('npm', ['view', pkg, 'version']);
  let version;
  let error = '';
  cp.stdout.on('data', (data) => (version = data.toString().trim()));
  cp.stderr.on('data', (err) => (error += err.toString()));

  cp.on('close', () => {
    if (error) return reject(error);
    return resolve({
      pkg,
      version,
    });
  });
}));

const mapDependencies = (deps) => (
  Promise.resolve(deps.reduce((prev, curr) => {
    if (curr.pkg === 'react' || curr.pkg === 'react-dom') {
      prev.dependencies[curr.pkg] = `^${curr.version}`; // eslint-disable-line no-param-reassign
    } else {
      prev.devDependencies[curr.pkg] = `^${curr.version}`; // eslint-disable-line no-param-reassign
    }

    return prev;
  }, { dependencies: {}, devDependencies: {} }))
);

const writeFile = (content) => new Promise((resolve, reject) => {
  const p = path.join(__dirname, '..', 'src/app/dependencies.json');
  fs.writeFile(p, JSON.stringify(content, null, 2), (err) => {
    if (err) return reject(err);
    return resolve();
  });
});

const devDeps = Object.keys(devDependencies).map(mapTpPromise);
const deps = Object.keys(dependencies).map(mapTpPromise);

Promise.all([...devDeps, ...deps])
  .then(mapDependencies)
  .then(writeFile)
  .then(() => console.log(chalk.green('Success!')))
  .catch((err) => {
    console.log(chalk.red('Error!'));
    console.log(err);
  });
