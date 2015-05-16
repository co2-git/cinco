'use strict'

class Element {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static resolve (selector) {
    var resolved = { classes: [], attr: {} };

    var trans = selector
      .replace(/\./g, '|.')
      .replace(/#/g, '|#');

    var bits = trans.split(/\|/);

    bits.forEach(function (bit) {

      if ( /^\./.test(bit) ) {
        resolved.classes.push(bit.replace(/^\./, ''));
      }

      else if ( /^#/.test(bit) ) {
        resolved.id = bit.replace(/^#/, '');
      }

      else if ( /^\[.+\]$/.test(bit) ) {
        var attrBits = bit.split('=');
        resolved.attr[attrBits[0]] = attrBits[1];
      }

      else if ( /^[A-Za-z-_\$]/.test(bit) ) {
        resolved.element = bit;
      }

    });

    return resolved;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static is (elem, selector) {

    var dest = Element.resolve(selector);

    var src = Element.resolve(elem.selector);

    var attempts = [];

    if ( dest.element ) {
      attempts.push('element', src.element === dest.element);
    }

    if ( dest.classes.length ) {
      attempts.push('classes', src.classes.some(function (cl) {
        return dest.classes.some(function (_cl) {
          return _cl === cl;
        });
      }));
    }

    if ( dest.id ) {
      attempts.push('id',src.id === dest.id);
    }

    return attempts.every(function (attempt) {
      return attempt;
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (selector, attr, children) {
    this.selector   =   selector;
    this.attr       =   attr || {};
    this.children   =   children || [];
    this.conditions =   [];
    this.text       =   [];
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  text (text) {
    this.text.push(text);
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  find (selector) {
    var elements = [];

    function findElements (selector, element) {

      if ( element instanceof Element ) {
        if ( element.is(selector) ) {
          elements.push(element);
        }

        if ( Array.isArray(element.children) ) {
          element.children.forEach(function (child) {
            findElements(selector, child);
          });
        }
      }

      else if ( element instanceof Elements ) {
        element.each(function (child) {
          findElements(selector, child);
        });
      }

    }

    if ( Array.isArray(this.children) ) {
      this.children.forEach(child => findElements(selector, child));
    }

    return new Elements(elements);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  add (...children) {
    this.children.push(...children)
    return this
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  is (selector) {
    return Element.is(this, selector);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (props, tab) {
    return render(this, props, tab);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  empty () {
    this.children = [];
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  removeClass (className) {
    if ( this.attr.className ) {
      var classes = this.attr.className;

      if ( ! Array.isArray(this.attr.className) ) {
        classes = this.attr.className.split(/\s+/)
      }

      this.attr.className = classes
        .filter(_className => _className !== className)

      let regexp = new RegExp('\.' + className + '(\.|#|\\[|$)', 'g');

      if ( regexp.test(this.selector) ) {
        this.selector = this.selector.replace(regexp, '');
      }
    }
    return this
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  condition (condition) {
    this.conditions.push(condition);
    return this
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Element

import render from './toHTML'
import Elements from './Elements'
