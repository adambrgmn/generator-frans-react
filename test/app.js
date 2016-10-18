'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-frans-react:app', () => {
  before(() => helpers.run(path.join(__dirname, '../src/app'))
    .withPrompts({ someAnswer: true })
    .toPromise());

  it('creates files', () => {
    assert.file([
      'dummyfile.txt',
    ]);
  });
});
