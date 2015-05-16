'use strict'

class Elements {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (...element) {
    var args = [];

    for ( var i in arguments ) {
      args.push(arguments[i]);
    }

    this.elements = [];

    var arg;

    function parse () {
      for ( var i in arguments ) {
        if ( arguments[i] instanceof Element ) {
          this.elements.push(arguments[i]);
        }

        else if ( arguments[i] instanceof Elements ) {
          this.elements.push(arguments[i]);
        }

        else if ( typeof arguments[i] === 'function' ) {
          this.elements.push(arguments[i]);
        }
      }
    }

    if ( Array.isArray(elements) && arguments.length === 1 ) {
      elements.forEach(parse, this);
    }

    else {
      parse.apply(this, args);
    }

    if ( this instanceof Elements === false ) {
      var elements        =   new Elements();
      elements.elements   =   this.elements;
      return elements;
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  each (closure) {
    this.elements.forEach(closure);
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  forEach (closure) {
    this.elements.forEach(closure);
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  find (selector) {
    var found = [];

    this.elements.forEach(function (child) {
      child.find(selector).each(function (result) {
        found.push(result);
      });
    });

    return new Elements(found);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (props, tab) {
    return this.elements
      .map(element => {
        if ( element instanceof Element ) {
          return element.toHTML(props, tab);
        }

        if ( element instanceof Elements ) {
          return element.toHTML(props, tab);
        }
        
        if ( typeof element === 'function' ) {

          var elem = element(props);

          if ( elem instanceof Element || elem instanceof Elements ) {
            return elem.toHTML(props, tab);
          }
        }
      })
      .join("\n")
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export default Elements

import Element from './Element'
