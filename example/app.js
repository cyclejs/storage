import { run } from '@cycle/run';
import { makeDOMDriver, div, input } from '@cycle/dom';
import storageDriver from '../lib/index';

function main(sources) {
  const storageRequest$ = sources.DOM.select('input')
    .events('input')
    .map(ev => ({
        key: 'inputText',
        value: ev.target.value
    }));

  const vdom$ = sources.storage.local
    .getItem('inputText')
    .startWith('')
    .map(text => div([
      input({ attrs: { type: 'text' }, props: { value: text }}),
      div(['currently in localStorage under key "inputText": ' + text])
    ]));

  return {
    DOM: vdom$,
    storage: storageRequest$
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver,
})
