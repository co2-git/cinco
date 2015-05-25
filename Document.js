'use strict'

class Document {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (...children) {
    this.children = children
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  add (...children) {
    this.children.push(...children)
    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  find (selector) {
    let found = [];

    this.children.forEach(child => {

      if ( child instanceof Element ) {
        if ( child.is(selector) ) {
          found.push(child);
        }
      }

      child.find(selector).each(result => found.push(result));
    })

    return new Elements(...found);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (glue) {

    if ( typeof glue !== 'string' ) {
      glue = "\n";
    }

    let lines = [];

    lines.push(Document.doctype, '<meta charset="utf-8" />');

    lines.push(new Elements(...this.children).render());

    return lines.join(glue);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

Document.doctype = '<!doctype html>';

export default Document

import Elements from './Elements'
import Element from './Element'