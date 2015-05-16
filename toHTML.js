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
        .map(function (elem) {
          return render(elem, props);
        })
        .join("\n");
  }

  if ( child instanceof Element === false ) {
    throw new Error('Not an element: ' + child.constructor.name);
  }

  // Can we transform this Element?

  var cont = true;

  if ( typeof child.attributes.$condition === 'function' ) {
    cont = child.attributes.$condition(props);
  }

  else if ( typeof child.attributes.$condition === 'boolean' ) {
    cont = child.attributes.$condition;
  }

  if ( ! cont ) {
    return '';
  }

  // Resolve selector

  var resolved = Element.resolve(child.selector);

  // Element

  var element = resolved.element || 'div';

  // Class

  child.attributes.className = (child.attributes.className || []);
  
  child.attributes.className = child.attributes.className
    .concat(resolved.classes.filter(function (cl) {
      return child.attributes.className.every(function (_cl) {
        return _cl !== cl;
      });
    }));

  if ( ! child.attributes.id && resolved.id ) {
    child.attributes.id = resolved.id;
  }

  // Open tag

  var open = tab + '<' + element;

  var av;

  var classes;

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

  for ( var attributes in child.attributes ) {

    if ( attributes === 'className' ) {
      if ( typeof child.attributes.className === 'string' ) {
        classes = child.attributes.className.split(/\s+/);
      }
      else {
        classes = child.attributes.className;
      }

      if ( classes.length ) {
        open += ' class="' + classes.join(' ') + '"';
      }
    }

    else if ( ! /^\$/.test(attributes) ) {
    
      if ( typeof child.attributes[attributes] === 'function' ) {
        av = child.attributes[attributes](props);
      }

      else {
        av = child.attributes[attributes];
      }

      if ( av !== null && typeof av !== 'undefined' ) {
        open += ' ' + attributes + '="' + av + '"';
      }
    }
    
  }

  if ( child.attributes.$selfClosing ) {
    open += '/'
  }

  open += '>';
  
  // lines.push(open);

  if ( ! child.attributes.$selfClosing ) {
    
    if ( child.textNode.length ) {

      var text = child.textNode
        .map(text => {
          if ( typeof text === 'function' ) {
            return text(props);
          }
          return text;
        })
        .filter(text => typeof text === 'string')
        .join(child.textGlue);

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