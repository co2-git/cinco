'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _domain = require('domain');

var Compiler = (function () {
  function Compiler(element) {
    _classCallCheck(this, Compiler);

    this.element = element;
  }

  _createClass(Compiler, [{
    key: 'render',
    value: function render(tab, glue) {
      var _this = this;

      tab = tab || '';

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      // Make sure we have an Element

      if (this.element instanceof _Elements2['default']) {
        return this.element.render(tab, glue);
      }

      if (this.element instanceof _Element2['default'] === false) {
        throw new Error('Not an element: ' + this.element.constructor.name);
      }

      // Can we compile this Element?

      if (!this.element.satisfies()) {
        return lines.join(glue);
      }

      // children

      var children = this.element.children;

      // Resolve selector

      var _Element$resolve = _Element2['default'].resolve(this.element.selector);

      var element = _Element$resolve.element;
      var id = _Element$resolve.id;
      var attributes = _Element$resolve.attributes;
      var classes = _Element$resolve.classes;

      // Merge resolve and attributes

      if (!element) {
        element = 'div';
      }

      if (!this.element.attributes.id && id) {
        this.element.attributes.id = id;
      }

      for (var key in attributes) {
        if (!(key in this.element.attributes)) {
          this.element.attributes[key] = attributes[key];
        }
      }

      // Tag

      var openTag = '<' + element;

      // Classes

      classes = this.element.classes.concat(classes.filter(function (cl) {
        return _this.element.classes.every(function (_cl) {
          return _cl !== cl;
        });
      }));

      if (classes.length) {
        openTag += ' class="' + classes.join(' ') + '"';
      }

      // Attributes

      var attributeValue = undefined;

      for (var attribute in this.element.attributes) {

        if (typeof this.element.attributes[attribute] === 'function') {
          this.element.attributes[attribute] = this.element.attributes[attribute]();
        }

        if (attribute === 'className' || this.element.attributes[attribute] === false) {} else if (this.element.attributes[attribute] === true) {
          openTag += ' ' + attribute;
        } else {

          if (typeof this.element.attributes[attribute] === 'function') {
            attributeValue = this.element.attributes[attribute]();
          } else {
            attributeValue = this.element.attributes[attribute];
          }

          if (attributeValue !== null && typeof attributeValue !== 'undefined') {
            openTag += ' ' + attribute + '="' + attributeValue + '"';
          }
        }
      }

      // Self closing

      if (this.element.closed) {
        openTag += '/';
      }

      openTag += '>';

      var line = tab + openTag;

      // Children

      if (!this.element.closed) {

        // Text

        if (this.element.textNode) {

          var text = this.element.textNode;

          if (typeof text === 'function') {
            text = text();
          }

          line += (text || '') + '</' + element + '>';

          lines.push(line);
        } else if (Array.isArray(children) && children.length || typeof children === 'function' || children instanceof _Elements2['default']) {

          lines.push(line);

          if (typeof children === 'function') {
            children = children();
          }

          if (Array.isArray(children)) {
            children = new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(children))))();
          }

          lines.push(children.render(tab + '  '), tab + '</' + element + '>');

          return lines.join(glue);
        } else {
          lines.push(line + '</' + element + '>');
        }
      } else {
        lines.push(line);
      }

      return lines.join(glue);
    }
  }]);

  return Compiler;
})();

// let foo = new Element('div#my-id.my-class-1.my-class-2', {
//   'data-foo': 'barz', className: 'my-class-3'
// })
//   .addClass('my-class-4')
//   .add(new Element('p').text('hello'));

// // new Compiler(foo).render()

// //   .on('error', error => console.log('Compiler error', error))

// //   .then(
// //     lines => console.log('then ok', lines),
// //     error => console.log('then ko', error)
// //   )

// // new Compiler(foo).render().on("data", data=>console.log('data', data.toString()))

// new Compiler(foo).render().pipe(process.stdout)

exports['default'] = Compiler;
module.exports = exports['default'];
