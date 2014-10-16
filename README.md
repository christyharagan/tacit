Tacit
======

Overview
------

[Tacit/point-free](http://en.wikipedia.org/wiki/Tacit_programming) function chains. Like chains in 
[underscore](http://underscorejs.org) or [lo-dash](http://lodash.com), but with cleaner syntax. To compare:

Underscore:

```javascript
var countUnique = function(array) {
  return _.chain(array)
    .uniq()
    .size();
}
```

Lo-dash

```javascript
var countUnique = function(array) {
  return _(array)
    .uniq()
    .size();
}
```

Tacit:

```javascript
var countUnique = _()
  .uniq()
  .size();
```



Usage
------

Install:

```
npm install tacit
```

Basic usage:

```javascript
var tacit = require('tacit');
var _ = require('underscore');

var _t = tacit(_);

var countUnique = _t()
  .flatten()
  .uniq()
  .size();

var size = countUnique([[1,2],[2,3]]);

// prints 3
console.log(size);
```

If no functions are added to the chain, then the tacit function is just the identity function, i.e.:
 
```javascript
var _t = tacit(_);

var value = _t('Hello World');

// prints 'Hello World'
console.log(value);
```

To support arguments that aren't in the last position, either set the default position:

```javascript
var _t = tacit(_, 0);

var countUnique = _t()
  .map(String.length)
  .sortBy(Math.sin);


var sizes = countUnique(['the', 'quick', 'jumped', 'over', 'a', 'of]);

// prints [5, 4, 6, 3, 1, 2]
console.log(sizes);
```

A value of -1 for the default position means: "insert in the last position". If a value isn't specified for the default
position, -1 is assumed.

Another option is to use the special $ operator:

```javascript
var $ = tacit.$;
var _t = tacit(_);

var countUnique = _t()
  .map($, String.length)
  .sortBy($. Math.sin);
```

This overrides the default position on a function-by-function basis.
