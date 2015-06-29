'use strict';

import Element    from './lib/element';
import Elements   from './lib/elements';
import Document   from './lib/document';
import Compiler   from './lib/compiler';

function Cinco () {
  this.Element     =   Element;
  this.Elements    =   Elements;
  this.Document    =   Document;
  this.Compiler    =   Compiler;
  this.render      =   Compiler;
}

let cinco = new Cinco();

export default cinco;

if ( typeof window !== 'undefined' ) {
  window.cinco = cinco;
}
