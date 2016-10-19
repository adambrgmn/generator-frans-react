'use strict';

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _yosay = require('yosay');

var _yosay2 = _interopRequireDefault(_yosay);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _yeomanGenerator2.default.Base.extend({
  prompting: function prompting() {
    var _this = this;

    // Have Yeoman greet the user.
    this.log((0, _yosay2.default)('Welcome my friend, this will setup an absolutely magnificient ' + _chalk2.default.red('React') + ' application for you.'));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your application?',
      default: (0, _lodash.kebabCase)(this.appname)
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      _this.props = props;
    });
  },


  writing: {
    package: function _package() {
      var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var pkg = (0, _lodash.merge)({
        name: (0, _lodash.kebabCase)(this.props.name),
        version: '0.0.0',
        description: '',
        homepage: '',
        author: ''
      }, currentPkg);

      pkg.dependencies = {
        react: '^15.3.2',
        'react-dom': '^15.3.2'
      };

      pkg.devDependencies = {
        autoprefixer: '^6.5.1',
        'babel-cli': '^6.16.0',
        'babel-eslint': '^7.0.0',
        'babel-loader': '^6.2.5',
        'babel-plugin-transform-class-properties': '^6.16.0',
        'babel-plugin-transform-object-rest-spread': '^6.16.0',
        'babel-plugin-transform-react-jsx-self': '^6.11.0',
        'babel-plugin-transform-react-jsx-source': '^6.9.0',
        'babel-plugin-transform-regenerator': '^6.16.1',
        'babel-plugin-transform-runtime': '^6.15.0',
        'babel-preset-latest': '^6.16.0',
        'babel-preset-react': '^6.16.0',
        'babel-preset-react-hmre': '^1.1.1',
        'babel-register': '^6.16.3',
        'babel-runtime': '^6.11.6',
        'clean-webpack-plugin': '^0.1.13',
        'css-loader': '^0.25.0',
        eslint: '^3.8.1',
        'eslint-config-airbnb': '^12.0.0',
        'eslint-plugin-babel': '^3.3.0',
        'eslint-plugin-import': '^2.0.1',
        'eslint-plugin-jsx-a11y': '^2.2.3',
        'eslint-plugin-react': '^6.4.1',
        'extract-text-webpack-plugin': '^1.0.1',
        'file-loader': '^0.9.0',
        'html-webpack-plugin': '^2.22.0',
        'image-webpack-loader': '^3.0.0',
        'json-loader': '^0.5.4',
        'node-sass': '^3.10.1',
        'postcss-loader': '^1.0.0',
        'resolve-url-loader': '^1.6.0',
        'sass-loader': '^4.0.2',
        'style-loader': '^0.13.1',
        'url-loader': '^0.5.7',
        webpack: '^1.13.2',
        'webpack-merge': '^0.15.0',
        'webpack-validator': '^2.2.9'
      };

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  },

  install: function install() {
    this.installDependencies();
  }
});