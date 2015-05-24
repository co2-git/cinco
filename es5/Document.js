'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Streamable = require('./Streamable');

var _Streamable2 = _interopRequireDefault(_Streamable);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var Document = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Document() {
    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    _classCallCheck(this, Document);

    this.children = children;
  }

  _createClass(Document, [{
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var found = [];

      this.children.forEach(function (child) {

        if (child instanceof _Element2['default']) {
          if (child.is(selector)) {
            found.push(child);
          }
        }

        child.find(selector).each(function (result) {
          return found.push(result);
        });
      });

      return new (_bind.apply(_Elements2['default'], [null].concat(found)))();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(glue) {

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      lines.push(Document.doctype, '<meta charset="utf-8" />');

      lines.push(new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(this.children))))().render());

      return lines.join(glue);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Document;
})();

Document.doctype = '<!doctype html>';

exports['default'] = Document;
module.exports = exports['default'];
