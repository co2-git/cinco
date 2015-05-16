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

  // attr()

  p = new Element('p', { 'data-foo': 'barz' }).attr('title', 'hello');

  p.attr('title').should.be.exactly('hello');
  p.attr('data-foo').should.be.exactly('barz');

  p.attributes.title.should.be.exactly('hello');
  p.attributes['data-foo'].should.be.exactly('barz');

  p.render().should.be.exactly('<p data-foo="barz" title="hello"></p>');

  // text()

  p = new Element('p');

  p.text('A');

  p.text().should.be.exactly('A');

  p.render().should.be.exactly('<p>A</p>');

  p.text('B');

  p.text().should.be.exactly('B');

  p.render().should.be.exactly('<p>B</p>');

  p.text(function (props) {
    return props.letter;
  });

  p.text().should.be.a.Function;

  p.render({ letter: 'C' }).should.be.exactly('<p>C</p>');

  // condition()

  p = new Element('p').condition(true);

  p.satisfies().should.be.true;

  p.render().should.be.exactly('<p></p>');

  p.condition(false);

  p.satisfies().should.be.false;

  p.render().should.be.exactly('');

  // find()

  p = new Element('p').add(
    new Element('findMeByElementName'),
    new Element('.findMeByClassName'),
    new Element('#findMeById'),
    new Element('[findMeByAttribute]')
  );

  var findByTag = p.find('findMeByElementName');

  findByTag.should.be.an.instanceof(Elements);

  findByTag.length.should.be.a.Number.and.is.exactly(1);

  findByTag.get(0).selector.should.be.exactly('findMeByElementName');

  p.find('div').length.should.be.exactly(3);

  var findByClass = p.find('.findMeByClassName');

  findByClass.should.be.an.instanceof(Elements);

  findByClass.length.should.be.a.Number.and.is.exactly(1);

  findByClass.get(0).selector.should.be.exactly('.findMeByClassName');

  var findById = p.find('#findMeById');

  findById.should.be.an.instanceof(Elements);

  findById.length.should.be.a.Number.and.is.exactly(1);

  findById.get(0).selector.should.be.exactly('#findMeById');

  // is()

  p = new Element('p').add(new Element('p'));

  p.is('p').should.be.true;

  p.find('p').is('p').should.be.true;

  // empty()

  p.empty();

  p.children.length.should.be.exactly(0);

  // remove

  p.add(new Element('p'));

  p.children.length.should.be.exactly(1);

  p.remove(function (child) {
    return false;
  });

  p.children.length.should.be.exactly(1);

  p.remove(function (child) {
    return true;
  });

  p.children.length.should.be.exactly(0);

  // find by text

  p = new Element('p').add(new Element('div.found').text('Click me!'));

  var found = p.findByText('Click me!');

  found.should.be.an.instanceof(Elements);

  found.elements.length.should.be.exactly(1);

  found = p.findByText(/click/i);

  found.should.be.an.instanceof(Elements);

  found.elements.length.should.be.exactly(1);

  // classname

  p = new Element('p.foo', { className: 'bar' });

  p.render().should.be.exactly('<p class="bar foo"></p>');

  p.hasClass('foo').should.be.true;

} ();
