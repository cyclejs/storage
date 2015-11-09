import { Rx } from '@cycle/core';

export default {
  // For localStorage.
  local: {
    key(n) {
      // Function returning Observable of the nth key.
      return Rx.Observable.just(localStorage.key(n));
    },
    // Function returning Observable of values.
    getItem(key) {
      return Rx.Observable.just(localStorage.getItem(key));
    },
  },
  // For sessionStorage.
  session: {
    // Function returning Observable of the nth key.
    key(n) {
      return Rx.Observable.just(sessionStorage.key(n));
    },
    // Function returning Observable of values.
    getItem(key) {
      return Rx.Observable.just(sessionStorage.getItem(key));
    },
  },
};
