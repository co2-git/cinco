'use strict';

import Elements     from './Elements';
import Element      from './Element';
import {Domain}     from 'domain';

class Compiler  {
  
  constructor (element) {
    this.element = element;
  }

  render (tab, glue) {
    
    tab = tab || '';

    if ( typeof glue !== 'string' ) {
      glue = "\n";
    }
    
    let lines = [];

    // Make sure we have an Element

    if ( this.element instanceof Elements ) {
      return this.element.render(tab, glue);
    }

    if ( this.element instanceof Element === false ) {
      throw new Error('Not an element: ' + this.element.constructor.name);
    }

    // Can we compile this Element?

    if ( ! this.element.satisfies() ) {
      return lines.join(glue);
    }

    // children

    let children = this.element.children;

    // Resolve selector

    let { element, id, attributes, classes } = Element
      .resolve(this.element.selector);

    // Merge resolve and attributes

    if ( ! element ) {
      element = 'div';
    }

    if ( ! this.element.attributes.id && id ) {
      this.element.attributes.id = id;
    }

    for ( var key in attributes ) {
      if ( ! ( key in this.element.attributes ) ) {
        this.element.attributes[key] = attributes[key];
      }
    }

    // Tag

    let openTag = '<' + element;

    // Classes

    classes = this.element.classes.concat(
      classes.filter(
        cl =>  this.element.classes.every(
          _cl => _cl !== cl
        )
      )
    );

    if ( classes.length ) {
      openTag += ' class="' + classes.join(' ') + '"';
    }

    // Attributes

    let attributeValue;

    for ( let attribute in this.element.attributes ) {

      if ( typeof this.element.attributes[attribute] === 'function' ) {
        this.element.attributes[attribute] = this.element.attributes[attribute]();
      }

      if ( attribute === 'className' || this.element.attributes[attribute] === false ) {
        
      }

      else if ( this.element.attributes[attribute] === true ) {
        openTag += ' ' + attribute;
      }

      else {
      
        if ( typeof this.element.attributes[attribute] === 'function' ) {
          attributeValue = this.element.attributes[attribute]();
        }

        else {
          attributeValue = this.element.attributes[attribute];
        }

        if ( attributeValue !== null && typeof attributeValue !== 'undefined' ) {
          openTag += ' ' + attribute + '="' + attributeValue + '"';
        }
      }
  
    }

    // Self closing

    if ( this.element.closed ) {
      openTag += '/'
    }

    openTag += '>';

    let line = tab + openTag;

    // Children

    if ( ! this.element.closed ) {

      // Text
      
      if ( this.element.textNode ) {

        var text = this.element.textNode;

        if ( typeof text === 'function' ) {
          text = text();
        }

        line += (text || '') + '</' + element + '>';

        lines.push(line);
      }

      else if ( 
        ( Array.isArray(children) && children.length ) ||
        typeof children === 'function' ||
        children instanceof Elements ) {

        lines.push(line);

        if ( typeof children === 'function' ) {
          children = children();
        }

        if ( Array.isArray(children) ) {
          children = new Elements(...children);
        }

        lines.push(children.render(tab + "  "), tab + '</' + element + '>');

        return lines.join(glue);
      }

      else {
        lines.push(line + '</' + element + '>');
      }
    }

    else {
      lines.push(line);
    }

    return lines.join(glue);
  }

}

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

export default Compiler;