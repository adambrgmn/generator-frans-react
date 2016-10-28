/* eslint-disable global-require */

if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions');
}

require('isomorphic-fetch');
Object.assign = require('object-assign');
