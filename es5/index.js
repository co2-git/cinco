'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

function Cinco() {
  this.Element = _Element2['default'];
  this.Elements = _Elements2['default'];
  this.Document = _Document2['default'];
  this.Compiler = _Compiler2['default'];
  this.render = _Compiler2['default'];
}

var cinco = new Cinco();

exports['default'] = cinco;

if (typeof window !== 'undefined') {
  window.cinco = cinco;
}
module.exports = exports['default'];
