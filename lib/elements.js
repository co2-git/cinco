'use strict'

class Elements {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get length () {
    return this.elements.length
  }

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

  get (index) {
    return this.elements[index]
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
    let found = []

    this.elements.forEach(child => 
      child.find(selector).each(found.push.bind(found))
    )

    return new Elements(...found)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (tab, glue) {

    tab = tab || '';

    if ( typeof glue !== 'string' ) {
      glue = "\n";
    }
    
    let lines = [];

    this.elements
      
      .map(element => {
        if ( typeof element === 'function' ) {
          element = element();
        }
        return element;
      })

      .filter(element => element instanceof Element || element instanceof Elements)

      .forEach(element => lines.push(element.render(tab, glue)));

    return lines.join(glue);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  is (selector) {
    return this.elements
      .filter(element => element instanceof Element || element instanceof Elements)
      .every(element => element.is(selector))
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export default Elements

import Element from './element';
