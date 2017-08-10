import {Stream} from 'xstream';
import getResponseObj from './util';
import {StorageRequest, ResponseCollection, StorageSource} from './index';

export default function(request$: Stream<StorageRequest>): ResponseCollection {
  return {
    // For localStorage.
    get local(): StorageSource {
      return getResponseObj(request$);
    },
    // For sessionStorage.
    get session(): StorageSource {
      return getResponseObj(request$, 'session');
    },
  };
}
