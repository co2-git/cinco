'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libElement = require('./lib/element');

var _libElement2 = _interopRequireDefault(_libElement);

var _libElements = require('./lib/elements');

var _libElements2 = _interopRequireDefault(_libElements);

var _libDocument = require('./lib/document');

var _libDocument2 = _interopRequireDefault(_libDocument);

var _libCompiler = require('./lib/compiler');

var _libCompiler2 = _interopRequireDefault(_libCompiler);

function Cinco() {
  this.Element = _libElement2['default'];
  this.Elements = _libElements2['default'];
  this.Document = _libDocument2['default'];
  this.Compiler = _libCompiler2['default'];
  this.render = _libCompiler2['default'];
}

var cinco = new Cinco();

exports['default'] = cinco;

if (typeof window !== 'undefined') {
  window.cinco = cinco;
}
module.exports = exports['default'];
