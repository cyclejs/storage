/* eslint-disable */
var h = CycleDOM.h
var makeDOMDriver = CycleDOM.makeDOMDriver
var storageDriver = CycleStorageDriver.default

function main(response) {
  const DOM = response.DOM
  const storage = response.storage
  const storageRequest$ = DOM.select('input')
    .events('keydown')
    .debounce(50)
    .map(function(ev) {
      return {
        key: 'inputText',
        value: ev.target.value
      };
    });

  return {
    DOM: storage.local.getItem('inputText')
    .map(function(text) {
      return h('div', [
        h('input', { type: 'text', value: text}),
        h('div', 'currently in localStorage under key "inputText": ' + text),
      ])
    }),
    storage: storageRequest$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver,
})
