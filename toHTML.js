'use strict';

import Elements from './Elements'
import Element from './Element'

function render (child, props, tab) {

  tab = tab || '';

  var lines = [];

  // Make sure we have an Element

  if ( typeof child === 'function' ) {
    child = child(props);
  }

  if ( child instanceof Elements ) {
    child = child.elements;
  }

  if ( Array.isArray(child) ) {
    return
      child
        .map(elem => render(elem, props))
        .join("\n");
  }

  if ( child instanceof Element === false ) {
    throw new Error('Not an element: ' + child.constructor.name);
  }

  // Can we transform this Element?

  var cont = child.satisfies(props);

  if ( ! cont ) {
    return '';
  }

  // Resolve selector

  var resolved = Element.resolve(child.selector);

  // Element

  var element = resolved.element || 'div';

  if ( ! child.attributes.id && resolved.id ) {
    child.attributes.id = resolved.id;
  }

  // Open tag

  var open = tab + '<' + element;

  var attributeValue;

  if ( typeof child.attributes === 'text' ) {
    child.attributes = { $text: child.attributes };
  }

  if ( resolved.attributes && Object.keys(resolved.attributes).length ) {
    for ( var key in resolved.attributes ) {
      if ( ! (key in child.attributes) ) {
        child.attributes[key] = resolved.attributes[key];
      }
    }
  }

  // Class

  let classes = child.classes.concat(
    resolved.classes.filter(cl => 
      child.classes.every(_cl => _cl !== cl)
    ))

  if ( classes.length ) {
    open += ' class="' + classes.join(' ') + '"';
  }

  for ( var attributes in child.attributes ) {

    if ( attributes === 'className' ) {
      continue;
    }

    else {
    
      if ( typeof child.attributes[attributes] === 'function' ) {
        attributeValue = child.attributes[attributes](props);
      }

      else {
        attributeValue = child.attributes[attributes];
      }

      if ( attributeValue !== null && typeof attributeValue !== 'undefined' ) {
        open += ' ' + attributes + '="' + attributeValue + '"';
      }
    }
    
  }

  if ( child.attributes.$selfClosing ) {
    open += '/'
  }

  open += '>';
  
  // lines.push(open);

  if ( ! child.attributes.$selfClosing ) {
    
    if ( child.textNode ) {

      var text = child.textNode;

      if ( typeof text === 'function' ) {
        text = text(props);
      }

      open += text + '</' + element + '>';

      lines.push(open);
    }

    else if ( ( Array.isArray(child.children) && child.children.length ) ||
      typeof child.children === 'function' ||
      children instanceof Elements ) {

      lines.push(open);

      var children = child.children;

      if ( typeof children === 'function' ) {
        children = children(props);
      }

      if ( Array.isArray(children) ) {
        children = new Elements(...children);
      }

      lines.push(children.render(props, tab + "  "));

      lines.push(tab + '</' + element + '>');
    }

    else {
      lines.push(open + '</' + element + '>');
    }
  }

  else {
    lines.push(open);
  }

  return lines.join("\n");
}

export default render