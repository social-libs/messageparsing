function createLib (execlib) {
  'use strict';
  //return execlib.loadDependencies('client', [], require('./libindex').bind(null, execlib));
  return require('./libindex')(execlib);
}

module.exports = createLib;
