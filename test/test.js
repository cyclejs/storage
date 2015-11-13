var test = require('tape')
var makeStorageDriver = require('../lib/').makeStorageDriver
var writeToStore = require('../lib/writeToStore').default
var responseCollection = require('../lib/responseCollection').default

test('makeStorageDriver should be a driver factory', function(t) {
  t.plan(2)

  t.strictEqual(typeof makeStorageDriver, 'function')
  var output = makeStorageDriver()
  t.strictEqual(typeof output, 'function')
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

  localStorage.setItem('testKey', 'testValue')
  var key$ = responseCollection.local.key(0)
  key$.subscribe(function(key) {
    t.equal(key, 'testKey')
  })
  localStorage.clear()
})

test('responseCollection.local.getItem(key) should return an Observable item in localStorage', function(t) {
  t.plan(1)

  localStorage.setItem('testKey', 'testValue')
  var item$ = responseCollection.local.getItem('testKey')
  item$.subscribe(function(item) {
    t.equal(item, 'testValue')
  })
  localStorage.clear()
})

test('responseCollection.session.key(n) should return an Observable of the nth key in sessionStorage', function(t) {
  t.plan(1)

  sessionStorage.setItem('testKey', 'testValue')
  var key$ = responseCollection.session.key(0)
  key$.subscribe(function(key) {
    t.equal(key, 'testKey')
  })
  sessionStorage.clear()
})

test('responseCollection.session.getItem(key) should return an Observable item in sessionStorage', function(t) {
  t.plan(1)

  sessionStorage.setItem('testKey', 'testValue')
  var item$ = responseCollection.session.getItem('testKey')
  item$.subscribe(function(item) {
    t.equal(item, 'testValue')
  })
  sessionStorage.clear()
})
