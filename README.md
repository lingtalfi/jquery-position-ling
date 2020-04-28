Jquery position ling
===========
2020-04-28

An adaptation of the jquery.position method.


This is a cheaper version than [the original one](https://github.com/jquery/jquery/blob/master/src/offset.js#L102).
I dropped a few things I didn't understand, in particular the hooks variable.

But in most cases it should behave the same, I suppose.




Install
=======

```js
npm install jquery-position-ling
```


Usage
========

(in a web context)

```js
const jqp = require("jquery-position-ling");


let el = document.querySelector(".bg1");
console.log(jqp.position(el)); // Object { top: 135.6666717529297, left: 8 }
```




History Log
=============

- 1.0.0 -- 2020-04-28

    - initial commit

