# Cycle Storage Driver

A [Cycle.js](http://cycle.js.org) [Driver](http://cycle.js.org/drivers.html) for using
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and
[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 in the browser.

```
npm install --save cycle-storage-driver
```

## Usage

You can read the [API docs here](https://github.com/kahlil/cycle-storage-driver/blob/master/docs/api.md).

Basics:

```js
import Cycle from '@cycle/core';
import storageDriver from 'cycle-storage-driver';

function main(responses) {
  // ...
}

const drivers = {
  storage: storageDriver
}

Cycle.run(main, drivers);
```

Simple and normal use case ([JSBin demo](http://jsbin.com/xumuqi/15/edit?html,js,console,output)):

```js
function main({DOM, storage}) {
   const storageRequest$ = DOM.select('input')
    .events('keypress')
    .map(function(ev) {
      return {
        key: 'inputText',
        value: ev.target.value
      };
    });

  return {
    DOM: storage.local.getItem('inputText')
    .startWith('')
    .map((text) =>
      h('input', {
        type: 'text',
        value: text
      })
    ),
    storage: storageRequest$
  };
}
```
# Test Status

[![Sauce Test Status](https://saucelabs.com/browser-matrix/superka.svg)](https://saucelabs.com/u/superka)

# License

[MIT](https://github.com/kahlil/cycle-storage-driver/blob/master/LICENSE)
