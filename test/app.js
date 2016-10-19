import { join } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

describe('generator-frans-react:app', () => {
  before(function before() {
    this.answers = {
      name: 'my-app',
      description: 'A React app',
      homepage: 'http://fransvilhelm.com',
      githubAccount: 'adambrgmn',
      authorName: 'Adam Bergman',
      authorEmail: 'adam@fransvilhelm.com',
      authorUrl: 'http://fransvilhelm.com',
      keywords: ['foo', 'bar'],
    };

    return helpers.run(join(__dirname, '../src/app'))
      .withPrompts(this.answers)
      .toPromise();
  });

  it('should create static files', () => {
    assert.file([
      '.babelrc',
      '.editorconfig',
      '.eslintrc',
      '.gitignore',
      '.stylelint',
      'webpack/index.ejs',
      'webpack/parts.js',
      'webpack/paths.js',
      'src/index.js',
      'src/styles.scss',
      'src/styles/_variables.scss',
      'test/setup.js',
      'test/components/App.spec.js',
    ]);
  });

  it('should create a package.json file', function it() {
    const { answers } = this;

    assert.file(['package.json']);
    assert.jsonFileContent('package.json', {
      name: answers.name,
      version: '0.0.0',
      description: answers.description,
      homepage: answers.homepage,
      repository: `${answers.githubAccount}/${answers.name}`,
      author: {
        name: answers.authorName,
        email: answers.authorEmail,
        url: answers.authorUrl,
      },
      keywords: this.answers.keywords,
      main: 'src/index.js',
    });
  });

  it('should create README.md', function it() {
    const { name } = this.answers;

    assert.file('README.md');
    assert.fileContent('README.md', `# ${name}`);
  });

  it('should create LICENSE', function it() {
    const { authorName, authorEmail, authorUrl } = this.answers;
    assert.file('LICENSE');
    assert.fileContent('LICENSE', `Copyright (c) 2016 ${authorName} <${authorEmail}> (${authorUrl})`);
  });

  it('should create webpack.config.babel.js', function it() {
    const { name } = this.answers;
    assert.file('webpack.config.babel.js');
    assert.fileContent('webpack.config.babel.js', `title: '${name}',`);
  });

  it('should setup Git', () => {
    assert.file(['.gitignore', '.gitattributes', '.git']);
    assert.fileContent('.gitignore', 'build\nstats.json');
  });
});
