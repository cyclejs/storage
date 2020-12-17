import xs, {Stream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import {adapt} from '@cycle/run/lib/adapt';
import {StorageRequest, StorageSource, Target} from './index';

const extStorageProducer = {
    start: function (listener) {
        this.sendReq = function(storage): void {
            listener.next({
                target: 'local',
                key: storage.key,
                value: storage.newValue
            })
        }
        window.addEventListener('storage', this.sendReq)
    },

    stop: function () {
        window.removeEventListener('storage', this.sendReq)
    }
}

const extStorage$: Stream<StorageRequest> = typeof window !== "undefined"
    ? xs.create(extStorageProducer)
    : xs.never()

function getStorage$(
  request$: Stream<StorageRequest>,
  type: Target,
): Stream<StorageRequest> {
  if (type === 'local') {
    return xs.merge(
        request$.filter(req => !req.target || req.target === 'local'),
        extStorage$
    );
  } else {
    return request$.filter(req => req.target === 'session');
  }
}

function storageKey(
  n: number,
  request$: Stream<StorageRequest>,
  type: Target = 'local',
): Stream<string> {
  const storage$: any = getStorage$(request$, type);
  const key: string =
    type === `local` ? localStorage.key(n) : sessionStorage.key(n);

  return storage$
    .filter(req => req.key === key)
    .map(req => req.key)
    .startWith(key)
    .compose(dropRepeats());
}

function storageGetItem<T>(
  key: string,
  request$: Stream<StorageRequest>,
  type: Target = 'local',
): Stream<T> {
  const storage$: any = getStorage$(request$, type);
  let storageObj = type === `local` ? localStorage : sessionStorage;

  return storage$
    .filter(req => req.key === key)
    .map(req => req.value)
    .startWith(storageObj.getItem(key));
}

export default function getResponseObj(
  request$: Stream<StorageRequest>,
  type: Target = 'local',
): StorageSource {
  return {
    // Function returning stream of the nth key.
    key(n: number) {
      return adapt(storageKey(n, request$, type));
    },
    // Function returning stream of item values.
    getItem<T>(key: string) {
      return adapt(storageGetItem<T>(key, request$, type));
    },
  };
}
