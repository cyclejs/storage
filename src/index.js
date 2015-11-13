import writeToStore from './writeToStore'
import responseCollection from './responseCollection'

export default function storageDriver(request$) {
  // Execute writing actions.
  request$.subscribe((request) => writeToStore(request))

  // Return reading functions.
  return responseCollection
}
