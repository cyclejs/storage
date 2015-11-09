/**
 * @function doAction
 * @description
 * A universal write function for localStorage and sessionStorage.
 * @param {string} [target=local] - a string determines which storage to use
 * @param {string} [action=setItem] - a string determines the write action
 * @param {string} key - the key of a storage item
 * @param {string} value - the value of a storage item
 */
export default function doAction(target = 'local', action = 'setItem', key = undefined, value = undefined) { // eslint-disable-line
  // Store the third and the fourth parameter in a new array, if defined.
  const storageArgs = Array.prototype.slice.call(arguments, 2)
  // Determine the storage target.
  const storage = target === `local` ? localStorage : sessionStorage

  // Execute the storage action and pass arguments if they were defined.
  storage[action](...storageArgs)
}
