if (!String.prototype.startsWith) {
  require('core-js/fn/string/starts-with');
}
if (!global.btoa) {
  global.btoa = require('./polyfills/btoa');
}
if (!global.Promise) {
  global.Promise = require('es6-promises');
}
if (!global.fetch) {
  global.fetch = require('node-fetch');
}


module.exports = require('./dist/ds-api');
