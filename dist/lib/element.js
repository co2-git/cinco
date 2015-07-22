'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _elements = require('./elements');

var _elements2 = _interopRequireDefault(_elements);

var Element = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Element(selector, attr, children) {
    var _this = this;

    _classCallCheck(this, Element);

    this.selector = selector;
    this.attributes = attr || {};
    this.children = children || [];
    this.conditions = [];
    this.textNode = '';

    var resolve = Element.resolve(selector);

    for (var i in resolve.attr) {
      if (!(i in this.attr)) {
        this.attr[i] = resolve.attr[i];
      }
    }

    if (resolve.classes.length) {
      this.classes;
      this.attributes.className = this.attributes.className || [];
      this.attributes.className = this.attributes.className.concat(resolve.classes.filter(function (className) {
        return _this.classes.every(function (attrClass) {
          return attrClass !== className;
        });
      }));
    }
  }

  _createClass(Element, [{
    key: 'classes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    get: function () {
      var classes = [];

      if (this.attributes && this.attributes.className) {

        if (typeof this.attributes.className === 'function') {
          this.attributes.className = [this.attributes.className];
        }

        if (typeof this.attributes.className === 'string') {
          this.attributes.className = this.attributes.className.split(/\s+/);
        }

        if (Array.isArray(this.attributes.className)) {
          classes = this.attributes.className;
        }
      }

      return classes;
    }
  }, {
    key: 'text',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function text(_text) {
      if (_text) {
        this.textNode = _text;
        return this;
      }

      return this.textNode;
    }
  }, {
    key: 'findByText',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findByText(text) {
      var elements = [];

      function findElements(text, element) {

        if (element instanceof Element) {
          if (text instanceof RegExp) {
            if (text.test(element.textNode)) {
              elements.push(element);
            }
          } else if (typeof text === 'string') {
            if (text === element.textNode) {
              elements.push(element);
            }
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(text, child);
            });
          }
        } else if (element instanceof _elements2['default']) {
          element.each(function (child) {
            findElements(text, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(text, child);
        });
      }

      return new (_bind.apply(_elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var elements = [];

      function findElements(selector, element) {

        if (element instanceof Element) {
          if (element.is(selector)) {
            elements.push(element);
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(selector, child);
            });
          }
        } else if (element instanceof _elements2['default']) {
          element.each(function (child) {
            findElements(selector, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(selector, child);
        });
      }

      return new (_bind.apply(_elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(selector) {
      return Element.is(this, selector);
    }
  }, {
    key: 'close',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function close() {
      this.closed = true;
      return this;
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(tab) {
      return new _compiler2['default'](this).render(tab);
    }
  }, {
    key: 'empty',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function empty() {
      this.children = [];
      return this;
    }
  }, {
    key: 'remove',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function remove(fn) {
      this.children = this.children.filter(function (child) {
        return fn(child) ? false : true;
      });
      return this;
    }
  }, {
    key: 'hasClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function hasClass(className) {
      return this.classes.some(function (attrClass) {
        return attrClass === className;
      });
    }
  }, {
    key: 'addClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function addClass() {
      var _classes;

      for (var _len2 = arguments.length, classes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      (_classes = this.classes).push.apply(_classes, classes);
      return this;
    }
  }, {
    key: 'removeClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function removeClass(className) {
      var classes = this.classes;

      if (classes.length) {
        this.attributes.className = classes.filter(function (_className) {
          return _className !== className;
        });

        var regexp = new RegExp('(.' + className + ')(.|#|\\[|$)', 'g');

        if (regexp.test(this.selector)) {
          this.selector = this.selector.replace(regexp, '$2');
        }
      }

      return this;
    }
  }, {
    key: 'condition',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function condition() {
      var _conditions;

      for (var _len3 = arguments.length, conditions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        conditions[_key3] = arguments[_key3];
      }

      (_conditions = this.conditions).push.apply(_conditions, conditions);
      return this;
    }
  }, {
    key: 'satisfies',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function satisfies(props) {
      return this.conditions.every(function (condition) {
        if (typeof condition === 'function') {
          return condition(props);
        }
        if (typeof condition === 'boolean') {
          return condition;
        }
        return false;
      });
    }
  }, {
    key: 'attr',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function attr(getter, setter) {
      if ('1' in arguments) {
        this.attributes[getter] = setter;
        return this;
      }

      return this.attributes[getter];
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'resolve',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function resolve(selector) {
      var resolved = { classes: [], attributes: {} };

      var trans = selector.replace(/\./g, '|.').replace(/#/g, '|#').replace(/\[/g, '|[');

      var bits = trans.split(/\|/);

      bits.forEach(function (bit) {

        if (/^\./.test(bit)) {
          resolved.classes.push(bit.replace(/^\./, ''));
        } else if (/^#/.test(bit)) {
          resolved.id = bit.replace(/^#/, '');
        } else if (/^\[.+\]$/.test(bit)) {
          var attrBits = bit.replace(/^\[/, '').replace(/\]$/, '').split('=');
          resolved.attributes[attrBits[0]] = typeof attrBits[1] === 'undefined' ? true : attrBits[1];
        } else if (/^[A-Za-z-_\$]/.test(bit)) {
          resolved.element = bit;
        }
      });

      return resolved;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(elem, selector) {

      var dest = Element.resolve(selector);

      var src = Element.resolve(elem.selector);

      var attempts = [];

      if (dest.element) {
        attempts.push('element', src.element === dest.element);
      }

      if (dest.classes.length) {
        attempts.push('classes', src.classes.some(function (cl) {
          return dest.classes.some(function (_cl) {
            return _cl === cl;
          });
        }));
      }

      if (dest.id) {
        attempts.push('id', src.id === dest.id);
      }

      return attempts.every(function (attempt) {
        return attempt;
      });
    }
  }]);

  return Element;
})();

exports['default'] = Element;
module.exports = exports['default'];