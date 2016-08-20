import XStreamAdapter from '@cycle/xstream-adapter'
import writeToStore from './writeToStore'
import responseCollection, { ResponseCollection } from './responseCollection'

import { Stream } from 'xstream'
import { StreamAdapter } from '@cycle/base'

export interface StorageRequest
{
  target? : string
  action? : string
  key : string
  value: string
}

/**
 * Storage Driver.
 *
 * This is a localStorage and sessionStorage Driver for Cycle.js apps. The
 * driver is also a function, and it takes a stream of requests as input, and
 * returns a **`responseCollection`** with functions that allow reading from the
 * storage objects. The functions on the **`responseCollection`** return streams
 * of the storage data that was requested.
 *
 * **Requests**. The stream of requests should emit objects. These should be
 * instructions to write to the desired Storage object. Here are the `request`
 * object properties:
 *
 * - `target` *(String)*: type of storage, can be `local` or `session`, defaults
 * to `local`.
 * - `action` *(String)*: type of action, can be `setItem`, `removeItem` or
 * `clear`, defaults to `setItem`.
 * - `key` *(String)*: storage key.
 * - `value` *(String)*: storage value.
 *
 * **responseCollection**. The **`responseCollection`** is an Object that
 * exposes functions to read from local- and sessionStorage.
 *
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
 * @param request$ - a stream of write request objects.
 * @return {Object} the response collection containing functions
 * for reading from storage.
 * @function storageDriver
 */
function storageDriver(request$ : Stream<StorageRequest>, runStreamAdapter : StreamAdapter) : ResponseCollection {
  // Execute writing actions.
  request$.addListener({
    next: (request) => writeToStore(request),
    error: () => {},
    complete: () => {},
  })

  // Return reading functions.
  return responseCollection(request$, runStreamAdapter)
}

(<any> storageDriver).streamAdapter = XStreamAdapter

export default storageDriver
