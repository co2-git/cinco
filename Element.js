'use strict'

class Element {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static resolve (selector) {
    var resolved = { classes: [], attributes: {} };

    var trans = selector
      .replace(/\./g, '|.')
      .replace(/#/g, '|#')
      .replace(/\[/g, '|[');

    var bits = trans.split(/\|/);

    bits.forEach(function (bit) {

      if ( /^\./.test(bit) ) {
        resolved.classes.push(bit.replace(/^\./, ''));
      }

      else if ( /^#/.test(bit) ) {
        resolved.id = bit.replace(/^#/, '');
      }

      else if ( /^\[.+\]$/.test(bit) ) {
        var attrBits = bit.replace(/^\[/, '').replace(/\]$/, '').split('=');
        resolved.attributes[attrBits[0]] = typeof attrBits[1] === 'undefined'
          ? true : attrBits[1];
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

  get classes () {
    let classes = []

    if ( this.attributes && this.attributes.className ) {

      if ( typeof this.attributes.className === 'function' ) {
        this.attributes.className = [this.attributes.className];
      }

      if ( typeof this.attributes.className === 'string' ) {
        this.attributes.className = this.attributes.className.split(/\s+/)
      }

      if ( Array.isArray(this.attributes.className) ) {
        classes = this.attributes.className;
      }
    }

    return classes
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (selector, attr, children) {
    this.selector   =   selector;
    this.attributes =   attr || {};
    this.children   =   children || [];
    this.conditions =   [];
    this.textNode   =   ''

    let resolve = Element.resolve(selector)

    for ( var i in resolve.attr ) {
      if ( ! ( i in this.attr ) ) {
        this.attr[i] = resolve.attr[i];
      }
    }

    if ( resolve.classes.length ) {
      this.classes;
      this.attributes.className =  this.attributes.className || [];
      this.attributes.className = this.attributes.className.concat(
        resolve.classes.filter(className =>
          this.classes.every(attrClass => attrClass !== className )));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  text (text) {
    if ( text ) {
      this.textNode = text;
      return this;
    }

    return this.textNode;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  findByText (text) {
    var elements = [];

    function findElements (text, element) {

      if ( element instanceof Element ) {
        if ( text instanceof RegExp ) {
          if ( text.test(element.textNode) ) {
            elements.push(element);
          }
        }

        else if ( typeof text === 'string' ) {
          if ( text === element.textNode ) {
            elements.push(element);
          }
        }

        if ( Array.isArray(element.children) ) {
          element.children.forEach(function (child) {
            findElements(text, child);
          });
        }
      }

      else if ( element instanceof Elements ) {
        element.each(function (child) {
          findElements(text, child);
        });
      }

    }

    if ( Array.isArray(this.children) ) {
      this.children.forEach(child => findElements(text, child));
    }

    return new Elements(...elements);
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

    return new Elements(...elements);
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

  close () {
    this.closed = true;
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (tab) {
    return new Compiler(this).render(tab);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  empty () {
    this.children = [];
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  remove (fn) {
    this.children = this.children.filter(child => fn(child) ? false : true  );
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  hasClass (className) {
    return this.classes.some(attrClass => attrClass === className)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  addClass (...classes) {
    this.classes.push(...classes);
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  removeClass (className) {

    let { classes } = this

    if ( classes.length ) {
      this.attributes.className = classes
        .filter(_className => _className !== className)

      let regexp = new RegExp('\.' + className + '(\.|#|\\[|$)', 'g');

      if ( regexp.test(this.selector) ) {
        this.selector = this.selector.replace(regexp, '');
      }
    }

    return this
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  condition (...conditions) {
    this.conditions.push(...conditions);
    return this
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  satisfies (props) {
    return this.conditions.every(condition => {
      if ( typeof condition === 'function' ) {
        return condition(props);
      }
      if ( typeof condition === 'boolean' ) {
        return condition;
      }
      return false;
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  attr (getter, setter) {
    if ( '1' in arguments ) {
      this.attributes[getter] = setter;
      return this;
    }

    return this.attributes[getter];
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Element

import Compiler from './Compiler'
import Elements from './Elements'
