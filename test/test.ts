let localStorageMemory = require('localstorage-memory');
let sessionStorageMemory = require('localstorage-memory');
(global as any).localStorage = localStorageMemory;
(global as any).sessionStorage = sessionStorageMemory;

import * as test from 'tape';
import xs from 'xstream';
import writeToStore from '../src/writeToStore';
import responseCollection from '../src/responseCollection';
import storageDriver from '../src/index';


test('storageDriver should return source that yields according to the runStreamAdapter', function(t) {
  t.plan(1)

  localStorage.setItem('testKeyFoo', 'testValueFoo')

  var sink = xs.never()
  var source = storageDriver(sink)
  var observable = source.local.key('testKeyFoo')
  t.equal(typeof observable.addListener, 'function')

  localStorage.clear()
})

// localStorage
test('writeToStore function should write to localStore', function(t) {
  t.plan(2)

  writeToStore({key: 'testKey1', value: 'testValue1'})
  t.equal(localStorage.getItem('testKey1'), 'testValue1')
  localStorage.clear()

  writeToStore({
    target: 'local',
    action: 'setItem',
    key: 'testKey1',
    value: 'testValue1',
  })

  t.equal(localStorage.getItem('testKey1'), 'testValue1')

  localStorage.clear()
})

test('writeToStore function should remove item from localStore', function(t) {
  t.plan(2)

  localStorage.setItem('testKey2', 'testValue2')
  localStorage.setItem('testKey3', 'testValue3')

  writeToStore({action: 'removeItem', key: 'testKey2'})
  writeToStore({target: 'local', action: 'removeItem', key: 'testKey3'})

  t.equal(localStorage.getItem('testKey2'), null)
  t.equal(localStorage.getItem('testKey2'), null)

  localStorage.clear()
})

test('writeToStore function should clear localStore', function(t) {
  t.plan(4)

  writeToStore({key: 'testKey2', value: 'testValue2'})
  writeToStore({key: 'testKey3', value: 'testValue3'})
  writeToStore({action: 'clear'})

  t.equal(localStorage.getItem('testKey2'), null)
  t.equal(localStorage.getItem('testKey3'), null)

  writeToStore({key: 'testKey2', value: 'testValue2'})
  writeToStore({key: 'testKey3', value: 'testValue3'})
  writeToStore({target: 'local', action: 'clear'})

  t.equal(localStorage.getItem('testKey2'), null)
  t.equal(localStorage.getItem('testKey3'), null)
})

// sessionStorage
test('writeToStore function should write to sessionStore', function(t) {
  t.plan(1)

  writeToStore({target: 'session', key: 'testKey1', value: 'testValue1'})

  t.equal(sessionStorage.getItem('testKey1'), 'testValue1')

  sessionStorage.clear()
})

test('writeToStore function should remove item from sessionStore', function(t) {
  t.plan(1)

  sessionStorage.setItem('testKey2', 'testValue2')

  writeToStore({target: 'session', action: 'removeItem', key: 'testKey2'})

  t.equal(sessionStorage.getItem('testKey2'), null)

  sessionStorage.clear()
})

test('writeToStore function should clear sessionStore', function(t) {
  t.plan(2)

  writeToStore({target: 'session', key: 'testKey2', value: 'testValue2'})
  writeToStore({target: 'session', key: 'testKey3', value: 'testValue3'})
  writeToStore({target: 'session', action: 'clear'})

  t.equal(sessionStorage.getItem('testKey2'), null)
  t.equal(sessionStorage.getItem('testKey3'), null)

  localStorage.clear()
})

// responseCollection
test('responseCollection.local.key(n) should return an Observable of the nth key in localStorage', function(t) {
  t.plan(1)

  var testData = [
    {
      target: 'local',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue1',
    },
    {
      target: 'local',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue2',
    },
    {
      target: 'local',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue3',
    },
  ]

  var request$ = xs.fromArray(testData)

  localStorage.setItem('testKey', 'testValue')

  var key$ = responseCollection(request$).local.key(0)

  key$.addListener({
    next: function(response) {
      t.equal(response, 'testKey')
    },
    error: function(err) {
      t.fail(err)
    },
    complete: function() {},
  })

  localStorage.clear()
})

test('responseCollection.local.getItem(key) should return an Observable item in localStorage', function(t) {
  t.plan(3)

  var testData = [
    {
      target: 'local',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue1',
    },
    {
      target: 'local',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue2',
    },
  ]

  var request$ = xs.fromArray(testData)

  localStorage.setItem('testKey', 'testValue')

  var item$ = responseCollection(request$).local.getItem('testKey')
  var i = 0
  var expected = ['testValue', 'testValue1', 'testValue2']

  item$.addListener({
    next: function(item) {
      t.equal(item, expected[i])
      i++
    },
    error: function(err) {
      t.fail(err)
    },
    complete: function() {},
  })

  localStorage.clear()
})

test('responseCollection.local.getItem(key) emit null if localStorage does not contain item for key', function(t) {
  t.plan(1)

  var request$ = xs.empty()
  var item$ = responseCollection(request$).local.getItem('notExisting')

  item$.addListener({
    next: function(response) {
      t.equal(response, null)
    },
    error: function() {
      t.fail('unxepected error')
    },
    complete: function() {
      t.end()
    },
  })
})

test('responseCollection.session.key(n) should return an Observable of the nth key in sessionStorage', function(t) {
  t.plan(1)

  var testData = [
    {
      target: 'session',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue1',
    },
    {
      target: 'session',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue2',
    },
    {
      target: 'session',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue3',
    },
  ]

  var request$ = xs.fromArray(testData)

  sessionStorage.setItem('testKey', 'testValue')

  var key$ = responseCollection(request$).session.key(0)

  key$.addListener({
    next: function(response) {
      t.equal(response, 'testKey')
    },
    error: function(err) {
      t.fail(err)
    },
    complete: function() {},
  })

  sessionStorage.clear()
})

test('responseCollection.session.getItem(key) should return an Observable item in sessionStorage', function(t) {
  t.plan(3)

  var testData = [
    {
      target: 'session',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue1',
    },
    {
      target: 'session',
      action: 'setItem',
      key: 'testKey',
      value: 'testValue2',
    },
  ]

  var request$ = xs.fromArray(testData)

  sessionStorage.setItem('testKey', 'testValue')

  var item$ = responseCollection(request$).session.getItem('testKey')
  var i = 0
  var expected = ['testValue', 'testValue1', 'testValue2']

  item$.addListener({
    next: function(item) {
      t.equal(item, expected[i])
      i++
    },
    error: function(err) {
      t.fail(err)
    },
    complete: function() {},
  })

  sessionStorage.clear()
})

test('responseCollection.local.getItem(key) emit null if sessionStorage does not contain item for key', function(t) {
  t.plan(1)

  var request$ = xs.empty()
  var item$ = responseCollection(request$).session.getItem('notExisting')

  item$.addListener({
    next: function(response) {
      t.equal(response, null)
    },
    error: function() {
      t.fail('unxepected error')
    },
    complete: function() {
      t.end()
    },
  })
})
