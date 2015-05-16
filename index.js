! function () {
  
  'use strict';

  require("babel/register")({ modules: 'common' });

  exports.Element     =   require('./Element');
  exports.Elements    =   require('./Elements');
  exports.Document    =   require('./Document');
  exports.toHTML      =   require('./toHTML');
  exports.render      =   require('./toHTML');

} ();
