cinco
===

HTML5 as es6 objects - easy to manipulate and render.

# Overview

Example on how to create a HTML5 document and then render it to string

```js

import { Document, Element } from cinco;

// Create a new HTML5 document

let document = new Document();

// Create a new HTML5 element

let div = new Element('#main.my-div', { role: 'main' })
    .text(props => 'Hello ' + props.name);

// Append div

document.add(div)

// Search in document

document.find('.my-div').is('#main') // true

// Render to HTML string

document.render({ name: 'Funny Bear' }) // see results below
```

```html
<!doctype html>
<meta charset="utf-8" />
<div id="main" class="my-div" role="main">Hello Funny Bear</div>
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
console.log(myElement.render()); // <h1></h1>
```

You can declare attributes in the selector as well:

```js
let myElement = new Element('h1#foo.bar.barz');

console.log(myElement.render()); // <h1 id="foo" class="bar barz"></h1>
```

# Attributes

Attributes are passed as an object:

```js
let myElement = new Element('a', { 'href': '/users', 'target': '_blank' });

console.log(myElement.render()); // <a href="/" target="_blank"></a>

// You can also use the `attr` method
let myElement = new Element('a').attr('href', '/users');

console.log(myElement.render()); // <a href="/" target="_blank"></a>

// Get attribute
myElement.attr('href'); // /users

// Set attribute
myElement.attr('href', '/users/joe');
myElement.attr('href'); // /users/joe
```

You can also pass functions:

```js
var props = {
    signedIn: true,
    user: {
        id: 123
    }
}

// Use one function for attributes
let myElement = new Element('a', props => 
    props.signedIn  ? { href: '/users/' + props.user.id }
                    : { href: '/users/join' }
);
console.log(myElement.render(props)); // <a href="/users/123"></a>

// Use functions per attribute
let myElement = new Element('a', { href: props => '/users/' + props.user.id });
console.log(myElement.render(props)); // <a href="/users/123"></a>
```

# Manipulate text

```js
let p = new Element('p');

// Setter
p.text('Hello world!')
console.log(p.render()); // <p>Hello world!</p>

// Gettter
console.log(p.text()); // Hello world!
```

# Conditional rendering

The conditions, if one evaluated to false, will skip the rendering of the element.

```js
let element = new Element('p').condition(true);
element.render(); // <p></p>

let element = new Element('p').condition(false);
element.render(); // 

// You can use functions

let element = new Element('p').condition(props => props.score > 100);

element.render({ score: 200 }); // <p></p>

// Whether or not all conditions return to true

element.satisfies(); // true|false

// With props

let p = new Element('p')
    .condition(props => props.score > 100)
    .condition(props => props.average > 1000);

p.statisfies({ score: 500, average: 250 }); // false
```

# Append children

```js
let input = new Element('input', { type: 'text', $selfClosing: true });
let button = new Element('button').text('Click me!');

// Use the array arguments

let form = new Element('form', { method: 'POST' }, [input, button]);

// Or use the add method ()

let form = new Element('form', { method: 'POST' })
    .add(input, button);

// View results below

form.render();
```

```html
<form method="POST">
    <input type="text" />
</form>
```

# Clearing all children

```js
let form = new Element('form');
let fieldset = new Element('fieldset');

form.add(fieldset);

form.render(); // <form><fieldset></fieldset></form>

form.empty();

form.render(); // <form></form>
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