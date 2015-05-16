'use strict'

class Document {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor () {
    var children = [];

    for ( var i in arguments ) {

      if ( Array.isArray(arguments[i]) ) {
        children = children.concat(arguments[i]);
      }

      else {
        children.push(arguments[i]);
      }
    }

    if ( this instanceof Document === false ) {
      return new Document(children);
    }

    this.children = children;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  add () {
    for ( var i in arguments ) {
      this.children.push(arguments[i]);
    }

    return this;1    
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  find (selector) {
    var found = [];

    this.children.forEach(function (child) {

      if ( child instanceof Element ) {
        if ( child.is(selector) ) {
          found.push(child);
        }
      }

      child.find(selector).each(function (result) {
        found.push(result);
      });
    });

    return new Elements(found);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render (props) {
    var l = [Document.doctype];

    l.push('<meta charset="utf-8" />');

    l = l.concat( this.children.map( child => child.render(props) ) );

    l.push(new Elements().render(props));

    return l.join("\n");
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

Document.doctype = '<!doctype html>';

export default Document

import Elements from './Elements'
import Element from './Element'
