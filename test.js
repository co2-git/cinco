! function () {
  
  'use strict';

  require("babel/register")({});

  require('should');

  var Element     =   require('./Element');
  var Elements    =   require('./Elements');
  var Document    =   require('./Document');
  var toHTML      =   require('./toHTML');

  var document = new Document();

  var lines = document.render().split(/\n/)

  lines[0].should.be.exactly(Document.doctype);

  lines[1].should.be.exactly('<meta charset="utf-8" />');

  var p = new Element('p');

  p.selector.should.be.exactly('p');

  p.render().should.be.exactly('<p></p>');

  p = new Element('p.class1');

  p.render().should.be.exactly('<p class="class1"></p>');

  p = new Element('p.class1.class2');

  p.render().should.be.exactly('<p class="class1 class2"></p>');

  p = new Element('p#id.class1.class2');

  p.render().should.be.exactly('<p class="class1 class2" id="id"></p>');

  p.removeClass('class2');

  p.render().should.be.exactly('<p class="class1" id="id"></p>');

  let pChild = new Element('p.p-in-p');

  pChild.render().should.be.exactly('<p class="p-in-p"></p>');

  p.add(pChild);

} ();
