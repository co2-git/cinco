'use strict'

class Elements {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (...elements) {
    this.elements = elements;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  add (...elements) {
    this.elements.push(...elements);
    return this;
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
          return element.render(props, tab);
        }

        if ( element instanceof Elements ) {
          return element.render(props, tab);
        }
        
        if ( typeof element === 'function' ) {

          var elem = element(props);

          if ( elem instanceof Element || elem instanceof Elements ) {
            return elem.render(props, tab);
          }
        }
      })
      .join("\n")
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export default Elements

import Element from './Element'
