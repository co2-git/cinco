! function () {

  'use strict';

  var Element = require('./es5/Element');
  var Elements = require('./es5/Elements');
  var Document = require('./es5/Document');
  var Compiler = require('./es5/Compiler');

  function Cinco () {
    this.Element     =   Element;
    this.Elements    =   Elements;
    this.Document    =   Document;
    this.Compiler    =   Compiler;
    this.render      =   Compiler;
  }

  var cinco = new Cinco();

  module.exports = cinco;

  if ( typeof window !== 'undefined' ) {
    window.cinco = cinco;
  }


} ();
