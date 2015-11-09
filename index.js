import doAction from './lib/doAction'
import responseCollection from './lib/responseCollection'

export default function storageDriver(request$) {
  // Execute writing actions.
  request$.subscribe((request) => doAction(request))

  // Return reading functions.
  return responseCollection
}
