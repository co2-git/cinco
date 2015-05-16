'use strict';

import Elements from './Elements'
import Element from './Element'

function toHTML (child, props, tab) {
  
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
        .map(function (elem) {
          return toHTML(elem, props);
        })
        .join("\n");
  }

  if ( child instanceof Element === false ) {
    throw new Error('Not an element: ' + child.constructor.name);
  }

  // Can we transform this Element?

  var cont = true;

  if ( typeof child.attr.$condition === 'function' ) {
    cont = child.attr.$condition(props);
  }

  else if ( typeof child.attr.$condition === 'boolean' ) {
    cont = child.attr.$condition;
  }

  if ( ! cont ) {
    return '';
  }

  var resolved = Element.resolve(child.selector);

  var element = resolved.element || 'div';

  child.attr.className = (child.attr.className || []);
  
  child.attr.className = child.attr.className
    .concat(resolved.classes.filter(function (cl) {
      return child.attr.className.every(function (_cl) {
        return _cl !== cl;
      });
    }));

  if ( ! child.attr.id && resolved.id ) {
    child.attr.id = resolved.id;
  }

  var open = tab + '<' + element;

  var av;

  var classes;

  if ( typeof child.attr === 'text' ) {
    child.attr = { $text: child.attr };
  }

  if ( Object.keys(resolved.attr).lnegth ) {
    for ( var key in resolved.attr ) {
      if ( ! (key in child.attr) ) {
        child.attr[key] = resolved.attr[key];
      }
    }
  }

  for ( var attr in child.attr ) {

    if ( attr === 'className' ) {
      if ( typeof child.attr.className === 'string' ) {
        classes = child.attr.className.split(/\s+/);
      }
      else {
        classes = child.attr.className;
      }

      if ( classes.length ) {
        open += ' class="' + classes.join(' ') + '"';
      }
    }

    else if ( ! /^\$/.test(attr) ) {
    
      if ( typeof child.attr[attr] === 'function' ) {
        av = child.attr[attr](props);
      }

      else {
        av = child.attr[attr];
      }

      if ( av !== null && typeof av !== 'undefined' ) {
        open += ' ' + attr + '="' + av + '"';
      }
    }
    
  }

  if ( child.attr.$selfClosing ) {
    open += '/'
  }

  open += '>';
  
  // lines.push(open);

  if ( ! child.attr.$selfClosing ) {
    
    if ( child.attr.$text ) {
      if ( typeof child.attr.$text === 'string' ) {
        open += child.attr.$text + '</' + element + '>';
      }

      else if ( typeof child.attr.$text === 'function' ) {
        open += child.attr.$text(props) + '</' + element + '>';
      }

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
        children = new Elements(children);
      }

      lines.push(children.toHTML(props, tab + "  "));

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

export default toHTML