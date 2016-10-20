export default {
  start: 'webpack-dev-server',
  build: 'webpack',
  'build:stats': 'webpack --profile --json > stats.json',
  test: 'tape -r ./test/setup.js \'test/**/*.spec.js\' | tap-spec --color',
  deploy: 'gh-pages -d build',
};
