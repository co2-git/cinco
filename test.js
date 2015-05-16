! function () {
  
  'use strict';

  require("babel/register")({});

  require('should');

  var Element     =   require('./Element');
  var Elements    =   require('./Elements');
  var Document    =   require('./Document');
  var toHTML      =   require('./toHTML');

  // new Document

  var document = new Document();

  // new Document.render()

  var lines = document.render().split(/\n/)

  lines[0].should.be.exactly(Document.doctype);

  lines[1].should.be.exactly('<meta charset="utf-8" />');

  // new Elements

  var elements = new Elements(new Element('div'));

  elements.elements.should.be.an.Array;

  elements.elements.forEach(function (element) {
    element.should.be.an.instanceof(Element);
  });

  elements.elements.length.should.be.exactly(1);

  elements.elements[0].selector.should.be.exactly('div');

  elements.add(new Element('hr'));

  elements.elements.length.should.be.exactly(2);

  elements.elements[1].selector.should.be.exactly('hr');

  // new Element.render()

  var p = new Element('p');

  p.selector.should.be.exactly('p');

  p.render().should.be.exactly('<p></p>');

  // new Element('.class')

  p = new Element('p.class1');

  p.render().should.be.exactly('<p class="class1"></p>');

  p = new Element('p.class1.class2');

  p.render().should.be.exactly('<p class="class1 class2"></p>');

  // new Element('#id')

  p = new Element('p#id.class1.class2');

  p.render().should.be.exactly('<p class="class1 class2" id="id"></p>');

  // Element.removeClass()

  p.removeClass('class2');

  p.render().should.be.exactly('<p class="class1" id="id"></p>');

  // add()

  p = new Element('p');

  var pChild = new Element('p.p-in-p');

  pChild.render().should.be.exactly('<p class="p-in-p"></p>');

  p.add(pChild);

  p.render().replace(/(\n|\t)/g, '').should.be.exactly('<p>  <p class="p-in-p"></p></p>');

} ();
