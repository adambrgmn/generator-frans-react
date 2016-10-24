export default {
  start: 'webpack-dev-server',
  build: 'webpack',
  'build:stats': 'webpack --profile --json > stats.json',
  test: 'tape -r ./test/setup.js \'test/**/*.spec.js\' | tap-spec --color',
  predeploy: 'npm run build',
  deploy: 'gh-pages -d build',
};
