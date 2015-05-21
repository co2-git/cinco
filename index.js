'use strict';

import Element from './Element';
import Elements from './Elements';
import Document from './Document';
import toHTML from './toHTML';

function Cinco () {
  this.Element     =   Element;
  this.Elements    =   Elements;
  this.Document    =   Document;
  this.toHTML      =   toHTML;
  this.render      =   toHTML;
}

let cinco = new Cinco();

export default cinco;

if ( typeof window !== 'undefined' ) {
  window.cinco = cinco;
}
