export default {
  start: 'node webpack/start.js',
  build: 'node webpack/build.js',
  test: 'tape -r ./test/setup.js \'test/**/*.spec.js\' | tap-spec --color',
  predeploy: 'npm run build',
  deploy: 'gh-pages -d build',
};
