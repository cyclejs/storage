import Rx from 'rx'

export default function(request$) {
  return {
    // For localStorage.
    local: {
      key(n) {
        // Function returning Observable of the nth key.
        // return Rx.Observable.just(localStorage.key(n))
        return request$
          .filter((request) => request.target === `local`)
          .filter((request) => request.key === localStorage.key(n))
          .distinctUntilChanged()
          .startWith(localStorage.key(n))
      },
      // Function returning Observable of values.
      getItem(key) {
        // return Rx.Observable.just(localStorage.getItem(key))
        const startWith = localStorage.getItem(key) || ``

        return request$
          .filter((request) => !request.target || request.target === `local`)
          .filter((request) => request.key === key)
          .map((request) => request.value)
          .startWith(startWith)
      },
    },
    // For sessionStorage.
    session: {
      // Function returning Observable of the nth key.
      key(n) {
        return Rx.Observable.just(sessionStorage.key(n))
      },
      // Function returning Observable of values.
      getItem(key) {
        return Rx.Observable.just(sessionStorage.getItem(key))
      },
    },
  }
}
