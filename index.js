'use strict';

import Element from './Element';
import Elements from './Elements';
import Document from './Document';
import Compiler from './Compiler';

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
