import {StorageRequest} from './index';

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
function writeToStore(request: StorageRequest): void {
  const {target = 'local', action = 'setItem'} = request;
  const key: string | undefined = (request as any).key;
  const value: any = (request as any).value;
  // Determine the storage target.
  const storage: any = target === `local` ? localStorage : sessionStorage;

  // Execute the storage action and pass arguments if they were defined.
  storage[action](key, value);
}

export default writeToStore;
