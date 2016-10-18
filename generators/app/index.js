'use strict';

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _yosay = require('yosay');

var _yosay2 = _interopRequireDefault(_yosay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _yeomanGenerator2.default.Base.extend({
  prompting: function prompting() {
    var _this = this;

    // Have Yeoman greet the user.
    this.log((0, _yosay2.default)('Welcome to the classy ' + _chalk2.default.red('generator-frans-react') + ' generator!'));

    var prompts = [{
      type: 'confirm',
      name: 'someAnswer',
      message: 'Would you like to enable this option?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      _this.props = props;
    });
  },
  writing: function writing() {
    this.fs.copy(this.templatePath('dummyfile.txt'), this.destinationPath('dummyfile.txt'));
  },
  install: function install() {
    this.installDependencies();
  }
});