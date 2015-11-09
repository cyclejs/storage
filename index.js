import doAction from './lib/doAction'
import responseCollection from './lib/responseCollection'

export default function storageDriver(request$) {
  // Execute writing actions.
  request$.subscribe((req) => {
    doAction(req.target, req.action, req.key, req.value)
  })

  // Return reading functions.
  return responseCollection
}
