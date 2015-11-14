# Cycle Storage Driver

A [Cycle.js](http://cycle.js.org) [Driver](http://cycle.js.org/drivers.html) for using
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and
[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 in the browser.

```
npm install --save cycle-storage-driver
```

## Usage

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

Simple and normal use case:

```js
function main({ DOM, storage }) {
  // A stream of input values to store.
  const storageRequest$ = DOM.select('input')
    .events('keypress')
    .debounce(200)
    .map((ev) => {
      return {
        key: 'inputText',
        value: ev.target.value
      };
    });

  return {
    // Return the inital vtree with data from localStorage.
    DOM: Rx.Observable.just(
      h('input', {type: 'text', value: storage.local.getItem('inputText')})
    ),
    storage: storageRequest$,
  };
}
```

# License

[MIT](https://github.com/kahlil/cycle-storage-driver/blob/master/LICENSE)
