import dropRepeats from 'xstream/extra/dropRepeats'
import XStreamAdapter from '@cycle/xstream-adapter'

function getStorage$(request$, type) {
  if (type === `local`) {
    return request$.filter((req) => !req.target || req.target === `local`)
  } else {
    return request$.filter((req) => req.target === `session`)
  }
}

function storageKey(n, request$, type = `local`) {
  const storage$ = getStorage$(request$, type)
  const key = type === `local` ?
    localStorage.key(n) : sessionStorage.key(n)

  return storage$
    .filter((req) => req.key === key)
    .map((req) => req.key)
    .startWith(key)
    .compose(dropRepeats())
}

function storageGetItem(key, request$, type = `local`) {
  const storage$ = getStorage$(request$, type)
  let storageObj = type === `local` ? localStorage : sessionStorage

  return storage$
    .filter((req) => req.key === key)
    .map((req) => req.value)
    .startWith(storageObj.getItem(key))
}

export default function getResponseObj(request$, runSA, type = `local`) {
  return {
    // Function returning stream of the nth key.
    key(n) {
      return runSA.adapt(
        storageKey(n, request$, type),
        XStreamAdapter.streamSubscribe
      )
    },
    // Function returning stream of item values.
    getItem(key) {
      return runSA.adapt(
        storageGetItem(key, request$, type),
        XStreamAdapter.streamSubscribe
      )
    },
  }
}
