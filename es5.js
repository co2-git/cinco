! function () {
  
  'use strict';

  require("babel/register")({ modules: 'common' });

  function Cinco () {
    this.Element     =   require('./Element');
    this.Elements    =   require('./Elements');
    this.Document    =   require('./Document');
    this.toHTML      =   require('./toHTML');
    this.render      =   require('./toHTML');
  }

  var cinco = new Cinco();

  module.exports = cinco;

  if ( typeof window !== 'undefined' ) {
    window.cinco = cinco;
  }

} ();
