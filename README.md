# z-modifier
[![Build Status](https://travis-ci.org/ZeeCoder/z-modifier.svg?branch=master)](https://travis-ci.org/ZeeCoder/z-modifier)
[![npm version](https://badge.fury.io/js/z-modifier.svg)](http://badge.fury.io/js/z-modifier)

This module was written to handle modifier classes inspired by the [BEM](http://bem.info) methodology.

Since it's a CommonJS module, it must be used alongside with [Browserify](http://browserify.org/), or
something similar, like [WebPacker](http://webpack.github.io/).

## Example, explanation
```html
<div id="module"></div>
```

```js
var Modifier = require('z-modifier');

var mod = new Modifier(
    $('#module'),
    'module', // The base class the modifier string will be attached to
    '--', // Modifier separator, optional
    '_' // Value separator, optional
);

mod.on('modifier');
// -> Adds the "module--modifier" class
mod.get('modifier');
// -> true

mod.set('modifier', 'value');
// -> Replaces the "module--modifier" class with "module--modifier_value".
mod.get('modifier');
// -> 'value'

mod.off('modifier');
// Removes the "module--modifier_value" class.
mod.get('modifier');
// -> false

mod.toggle('modifier');
// -> Adds the "module--modifier" class.
mod.toggle('modifier');
// -> Removes the "module--modifier" class.
```

## License
[MIT](LICENSE)
