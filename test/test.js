var test = require('tape')
var Rx = require('rx')
var writeToStore = require('../lib/writeToStore').default
var responseCollection = require('../lib/responseCollection').default

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

  var request$ = Rx.Observable.from(testData)

  localStorage.setItem('testKey', 'testValue')

  var key$ = responseCollection(request$).local.key(0)

  key$.subscribe(function(response) {
    t.equal(response, 'testKey')
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

  var request$ = Rx.Observable.from(testData)

  localStorage.setItem('testKey', 'testValue')

  var item$ = responseCollection(request$).local.getItem('testKey')
  var i = 0
  var expected = ['testValue', 'testValue1', 'testValue2']

  item$.subscribe(function(item) {
    t.equal(item, expected[i])
    i++
  })

  localStorage.clear()
})

test('responseCollection.local.getItem(key) emit null if localStorage does not contain item for key', function(t) {
  t.plan(1)

  var request$ = Rx.Observable.empty()
  var item$ = responseCollection(request$).local.getItem('notExisting')

  item$.subscribe(function(response) {
    t.equal(response, null)
  }, function() {
    t.fail('unxepected error')
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

  var request$ = Rx.Observable.from(testData)

  sessionStorage.setItem('testKey', 'testValue')

  var key$ = responseCollection(request$).session.key(0)

  key$.subscribe(function(response) {
    t.equal(response, 'testKey')
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

  var request$ = Rx.Observable.from(testData)

  sessionStorage.setItem('testKey', 'testValue')

  var item$ = responseCollection(request$).session.getItem('testKey')
  var i = 0
  var expected = ['testValue', 'testValue1', 'testValue2']

  item$.subscribe(function(item) {
    t.equal(item, expected[i])
    i++
  })

  sessionStorage.clear()
})

test('responseCollection.local.getItem(key) emit null if sessionStorage does not contain item for key', function(t) {
  t.plan(1)

  var request$ = Rx.Observable.empty()
  var item$ = responseCollection(request$).session.getItem('notExisting')

  item$.subscribe(function(response) {
    t.equal(response, null)
  }, function() {
    t.fail('unxepected error')
  }, function() {
    t.end()
  })
})
