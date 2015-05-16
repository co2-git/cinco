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

  render (props) {
    let l = [Document.doctype];

    l.push('<meta charset="utf-8" />');

    l = l.concat( this.children.map( child => child.render(props) ) );

    return l.join("\n");
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

Document.doctype = '<!doctype html>';

export default Document

import Elements from './Elements'
import Element from './Element'
