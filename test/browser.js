var test = require('tape');
var writeToStore = require('../lib/writeToStore').default;

test('writeToStore function should write to localStore', function(t) {
  t.plan(2);

  writeToStore({key: 'testKey1', value: 'testValue1'});
  t.equal(localStorage.getItem('testKey1'), 'testValue1');
  localStorage.clear();

  writeToStore({target: 'local', action:'setItem', key: 'testKey1', value: 'testValue1'});
  t.equal(localStorage.getItem('testKey1'), 'testValue1');
  localStorage.clear();
});

test('writeToStore function should remove item from localStore', function(t) {
  t.plan(2);

  localStorage.setItem('testKey2', 'testValue2')
  localStorage.setItem('testKey3', 'testValue3')
  writeToStore({action: 'removeItem', key: 'testKey2'});
  writeToStore({target: 'local', action: 'removeItem', key: 'testKey3'});
  t.equal(localStorage.getItem('testKey2'), null);
  t.equal(localStorage.getItem('testKey2'), null);
  localStorage.clear();
});

test('writeToStore function should clear localStore', function(t) {
  t.plan(4);

  writeToStore({key: 'testKey2', value: 'testValue2'});
  writeToStore({key: 'testKey3', value: 'testValue3'});
  writeToStore({action: 'clear'});
  t.equal(localStorage.getItem('testKey2'), null);
  t.equal(localStorage.getItem('testKey3'), null);

  writeToStore({key: 'testKey2', value: 'testValue2'});
  writeToStore({key: 'testKey3', value: 'testValue3'});
  writeToStore({target: 'local', action: 'clear'});
  t.equal(localStorage.getItem('testKey2'), null);
  t.equal(localStorage.getItem('testKey3'), null);
});
