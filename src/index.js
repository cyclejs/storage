import writeToStore from './writeToStore'
import responseCollection from './responseCollection'

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
 * @param {Observable} an Observable of write request objects.
 * @return {Object} the response collection containing functions
 * for reading from storage.
 * @function storageDriver
 */
export default function storageDriver(request$) {
  // Execute writing actions.
  request$.subscribe((request) => writeToStore(request))

  // Return reading functions.
  return responseCollection
}
