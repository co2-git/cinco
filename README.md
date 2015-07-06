cinco
===

HTML5 as ES6 objects - easy to manipulate and render. Handy for rapid prototyping. Is isomorphic.

# Overview

Example on how to create a HTML5 document and then render it to string

```js

import { Document, Element } from cinco;

// Create a new HTML5 document

let document = new Document()

    .add(
        new Element('title').text('Good morning')
    );

// Update DOM

if ( new Date().getHours > 12 ) {
    document.find('title').get(0).text('Good evening');
}

// Render to string

document.render(); // see results below
```

```html
<!doctype html>
<meta charset="utf-8" />
<title>Good morning</title>
```

# ES5 support

```js
var cinco = require('cinco/dist'),
    Element = cinco.Element,
    Document = cinco.Document;
```

# Element

    new Element(
        { String | Function } selector,
        { Object | Function }? attributes,
        { [Element] | Elements | Function | [Function] }? children
    )


```js
// Create a h1 element
let myElement = new Element('h1');

// Get HTML source as string
myElement.render() // <h1></h1>
```

You can declare attributes in the selector as well:

```js
new Element('h1#foo.bar.barz'); // <h1 id="foo" class="bar barz"></h1>
```

# Attributes

Attributes are passed as an object:

```js
new Element('a', { 'href': '/' }); // <a href="/"></a>

// You can also use the `attr` method
new Element('a').attr('href', '/'); // <a href="/"></a>

// Pass a function
```

You can also pass functions:

```js
var props = {
    signedIn: true,
    user: {
        id: 123
    }
}

new Element('a', { href: () => '/' }); // <a href="/"></a>
new Element('a', { href: async() => await async() }); // You can use async functions
```

# Manipulate text

```js
let p = new Element('p');

// Setter
p.text('Hello world!') // <p>Hello world!</p>

// Gettter
p.text(); // Hello world!
```

# Conditional rendering

The conditions, if one evaluated to false, will skip the rendering of the element.

```js
new Element('p').condition(true); // <p></p>

new Element('p').condition(false); // 

// You can use functions

let element = new Element('p').condition(async() => await async());

// Whether or not all conditions return to true

element.satisfies(); // true|false
```

# Append children

```js
new Element('foo').add(new Element('bar')); // <foo><bar></bar></foo>
```

# Clearing all children

```js
new Element('foo').add(new Element('bar')).empty(); // <foo></foo>
```

# Remove a child

```js
let form = new Element('form');
let fieldset = new Element('fieldset');

form.add(fieldset);

form.render(); // <form><fieldset></fieldset></form>

// Act like an array filter() => true gets removed
form.remove(child => child.is('fieldset'));

form.render(); // <form></form>
```

# Find

Utility to find and manipulate elements. Returns `Elements`

```js
let form = new Element('form').add(
    new Element('fieldset').add(
        new Element('legend').text('Legend'),
        new Element('section.form-group').add(
            new Element('button')
        )
    )
);

// Find button and add text to it

form.find('button').each(button => button.text('Click me!'));

// Find an element by text

form.findByText('Click me!');

// Find an element by text using a regex

form.findByText(/click/i);
```

# Classes

```js
let elem = new Element('.c1', { className: 'c2 c3' }); // <div class="c1 c2 c3"></div>
let elem = new Element('.c1', { className: ['c2', 'c3'] }); // <div class="c1 c2 c3"></div>
let elem = new Element('.c1').addClass('c2', 'c3'); // <div class="c1 c2 c3"></div>
elem.removeClass('c3'); // <div class="c1 c2"></div>

elem.hasClass('c3'); // false
```