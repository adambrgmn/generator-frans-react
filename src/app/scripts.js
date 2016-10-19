export default {
  start: 'webpack-dev-server',
  build: 'webpack',
  'build:stats': 'webpack --profile --json > stats.json',
  test: 'tape-watch -1 -r ../test/setup.js \'test/**/*.spec.js\' -o \'| tap-spec --color\'',
  'test:watch': 'npm run test -- --watch',
};
