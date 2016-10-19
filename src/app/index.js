import { basename } from 'path';
import { Base } from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import _ from 'lodash';
import parseAuthor from 'parse-author';
import githubUsername from 'github-username';

import { dependencies, devDependencies } from './dependencies';
import scripts from './scripts';


module.exports = Base.extend({
  constructor(...args) {
    Base.apply(this, args);
  },

  initializing() {
    this.log(yosay(
      `Welcome my friend, this will setup an absolutely magnificient ${chalk.red('React')} application for you.`
    ));

    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const {
      name,
      description,
      version,
      homepage,
      author,
    } = this.pkg;

    this.props = {
      name,
      description,
      version,
      homepage,
    };

    if (_.isObject(author)) {
      this.props.authorName = author.name;
      this.props.authorEmail = author.email;
      this.props.authorUrl = author.url;
    } else if (_.isString(author)) {
      const info = parseAuthor(author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  },

  prompting: {
    askAppName() {
      if (this.pkg.name) {
        this.props.name = this.pkg.name;
        return;
      }

      // eslint-disable-next-line consistent-return
      return this.prompt({
        name: 'name',
        message: 'What\'s the name of your app?',
        default: basename(process.cwd()),
        filter: _.kebabCase,
        validate: (str) => str.length > 0,
      }).then(({ name }) => {
        this.props.name = name;
      });
    },
    askVarious() {
      const prompts = [
        {
          name: 'description',
          message: 'How would you describe your app, short and snappy?',
          when: !this.props.description,
        },
        {
          name: 'homepage',
          message: 'Project homepage url?',
          when: !this.props.homepage,
        },
        {
          name: 'authorName',
          message: 'Author\'s name',
          when: !this.props.authorName,
          default: this.user.git.name(),
          store: true,
        },
        {
          name: 'authorEmail',
          message: 'Author\'s email',
          when: !this.props.authorEmail,
          default: this.user.git.email(),
          store: true,
        },
        {
          name: 'authorUrl',
          message: 'Author\'s url',
          when: !this.props.authorUrl,
          store: true,
        },
        {
          name: 'keywords',
          message: 'Keywords (comma separated)',
          when: !this.pkg.keywords,
          filter: (words) => words.split(/\s*,\s*/g),
        },
      ];

      return this.prompt(prompts)
        .then((props) => {
          this.props = { ...this.props, ...props };
        });
    },
    askGithubUsername() {
      return githubUsername(this.props.authorEmail)
        .then((username) => username, () => '')
        .then((username) => this.prompt({
          name: 'githubAccount',
          message: 'GitHub username',
          default: username,
        }).then(({ githubAccount }) => {
          this.props.githubAccount = githubAccount;
        }));
    },
  },

  default() {
    const { name, githubAccount } = this.props;
    this.composeWith('node:git', {
      options: { name, githubAccount },
    }, {
      local: require.resolve('generator-node/generators/git'),
    });
  },

  writing: {
    writePackage() {
      const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      const pkg = {
        name: _.kebabCase(this.props.name),
        version: '0.0.0',
        description: this.props.description,
        homepage: this.props.homepage,
        repository: `${this.props.githubAccount}/${this.props.name}`,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl,
        },
        main: 'src/index.js',
        keywords: [],
        ...currentPkg,
      };

      if (this.props.keywords) {
        pkg.keywords = _.uniq(this.props.keywords.concat(currentPkg.keywords));
      }

      pkg.dependencies = dependencies;
      pkg.devDependencies = devDependencies;
      pkg.scripts = scripts;

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    writeStaticFiles() {
      const files = {
        babelrc: '.babelrc',
        editorconfig: '.editorconfig',
        eslintrc: '.eslintrc',
        gitignore: '.gitignore',
      };

      Object.keys(files).forEach((key) => {
        this.fs.copy(
          this.templatePath(key),
          this.destinationPath(files[key])
        );
      });
    },

    writeStaticDirs() {
      // src
      this.fs.copy(
        this.templatePath('src'),
        this.destinationPath('src')
      );

      // test

      this.fs.copy(
        this.templatePath('test'),
        this.destinationPath('test')
      );

      // webpack
      this.fs.copy(
        this.templatePath('webpack'),
        this.destinationPath('webpack')
      );
    },

    writeDynamicFiles() {
      // README.md
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        { appname: this.props.name }
      );

      // LICENSE
      this.fs.copyTpl(
        this.templatePath('LICENSE'),
        this.destinationPath('LICENSE'),
        {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl,
        }
      );

      // webpack.config.babel.js
      this.fs.copyTpl(
        this.templatePath('webpack.config.babel.js'),
        this.destinationPath('webpack.config.babel.js'),
        { appname: this.props.name }
      );
    },
  },
});
