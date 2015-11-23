(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CycleStorageDriver = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = storageDriver;

var _writeToStore = require('./writeToStore');

var _writeToStore2 = _interopRequireDefault(_writeToStore);

var _responseCollection = require('./responseCollection');

var _responseCollection2 = _interopRequireDefault(_responseCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Storage Driver.
 *
 * This is a localStorage and sessionStorage Driver for Cycle.js
 * apps. The driver is also a function, and it takes an Observable of requests
 * as input, and returns a **`responseCollection`** with functions that allow
 * reading from the storage objects. The functions on the
 * **`responseCollection`** return Observables of the storage data
 * that was requested.
 *
 * **Requests**. The Observable of requests should emit objects.
 * These should be instructions to write to the desired Storage object.
 * Here are the `request` object properties:
 *
 * - `target` *(String)*: type of storage, can be `local` or `session`,
 * defaults to `local`.
 * - `action` *(String)*: type of action, can be `setItem`, `removeItem` or
 * `clear`, defaults to `setItem`.
 * - `key` *(String)*: storage key.
 * - `value` *(String)*: storage value.
 *
 * **responseCollection**. The **`responseCollection`** is an Object that
 * exposes functions to read from local- and sessionStorage.
 * ```js
 * // Returns key of nth localStorage value.
 * responseCollection.local.getKey(n)
 * // Returns localStorage value of `key`.
 * responseCollection.local.getItem(key)
 * // Returns key of nth sessionStorage value.
 * responseCollection.session.getKey(n)
 * // Returns sessionStorage value of `key`.
 * responseCollection.session.getItem(key)
 * ```
 *
 * @param {Observable} request$ - an Observable of write request objects.
 * @return {Object} the response collection containing functions
 * for reading from storage.
 * @function storageDriver
 */
function storageDriver(request$) {
  // Execute writing actions.
  request$.subscribe(function (request) {
    return (0, _writeToStore2.default)(request);
  });

  // Return reading functions.
  return (0, _responseCollection2.default)(request$);
}

},{"./responseCollection":2,"./writeToStore":3}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (request$) {
  return {
    // For localStorage.
    local: {
      key: function key(n) {
        // Function returning Observable of the nth key.
        return _rx2.default.Observable.just(localStorage.key(n));
      },

      // Function returning Observable of values.
      getItem: function getItem(key) {
        // return Rx.Observable.just(localStorage.getItem(key))
        var startWith = localStorage.getItem(key) || '';
        return request$.filter(function (request) {
          return request.key === key;
        }).map(function (request) {
          console.log(request);
          return request.value;
        }).startWith(startWith);
      }
    },
    // For sessionStorage.
    session: {
      // Function returning Observable of the nth key.

      key: function key(n) {
        return _rx2.default.Observable.just(sessionStorage.key(n));
      },

      // Function returning Observable of values.
      getItem: function getItem(key) {
        return _rx2.default.Observable.just(sessionStorage.getItem(key));
      }
    }
  };
};

var _rx = (typeof window !== "undefined" ? window['Rx'] : typeof global !== "undefined" ? global['Rx'] : null);

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @function writeToStore
 * @description
 * A universal write function for localStorage and sessionStorage.
 * @param {object} request - the storage request object
 * @param {string} request.target - a string determines which storage to use
 * @param {string} request.action - a string determines the write action
 * @param {string} request.key - the key of a storage item
 * @param {string} request.value - the value of a storage item
 */
function writeToStore(_ref, storageUpdateSubject) {
  var _ref$target = _ref.target;
  var target = _ref$target === undefined ? "local" : _ref$target;
  var _ref$action = _ref.action;
  var action = _ref$action === undefined ? "setItem" : _ref$action;
  var key = _ref.key;
  var value = _ref.value;

  // Determine the storage target.
  var storage = target === "local" ? localStorage : sessionStorage;

  // Execute the storage action and pass arguments if they were defined.
  storage[action](key, value);
}

exports.default = writeToStore;

},{}]},{},[1])(1)
});