import dropRepeats from 'xstream/extra/dropRepeats'
import { Stream } from 'xstream'
import XStreamAdapter from '@cycle/xstream-adapter'
import { StreamAdapter } from '@cycle/base'
import { StorageRequest, ResponseObject } from './index'

function getStorage$(request$ : Stream<StorageRequest>, type : 'local' | 'session') : Stream<StorageRequest> {
  if (type === `local`) {
    return request$.filter((req) => !req.target || req.target === `local`)
  } else {
    return request$.filter((req) => req.target === `session`)
  }
}

function storageKey(n : number, request$ : Stream<StorageRequest>, type : 'local' | 'session' = 'local') : Stream<string> {
  const storage$ : Stream<StorageRequest> = getStorage$(request$, type)
  const key : string = type === `local` ?
    localStorage.key(n) : sessionStorage.key(n)

  return storage$
    .filter((req) => req.key === key)
    .map((req) => req.key)
    .startWith(key)
    .compose(dropRepeats())
}

function storageGetItem(key : string, request$ : Stream<StorageRequest>, type : 'local' | 'session' = 'local') : Stream<string> {
  const storage$ : Stream<StorageRequest> = getStorage$(request$, type)
  let storageObj : Storage = type === `local` ? localStorage : sessionStorage

  return storage$
    .filter((req) => req.key === key)
    .map((req) => req.value)
    .startWith(storageObj.getItem(key))
}

export default function getResponseObj(request$ : Stream<StorageRequest>, runSA : StreamAdapter, type : 'local' | 'session' = 'local') : ResponseObject {
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
