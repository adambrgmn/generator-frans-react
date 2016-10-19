import { join } from 'path';
import assert from 'yeoman-assert';
// import { expect } from 'chai';
import helpers from 'yeoman-test';
// import fs from 'fs-extra';

describe('generator-frans-react:app', () => {
  before(function before() {
    this.answers = {
      name: 'my app',
    };

    return helpers.run(join(__dirname, '../src/app'))
      .withPrompts(this.answers)
      .toPromise();
  });

  it('should create a package.json file', () => {
    assert.file('package.json');
    assert.jsonFileContent('package.json', {
      name: 'my-app',
      version: '0.0.0',
      description: '',
      homepage: '',
      repository: '',
      author: '',
    });
  });
});
