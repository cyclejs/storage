import getResponseObj from './util'
import { ResponseCollection } from './index'

export default function(request$, runStreamAdapter) : ResponseCollection {
  return {
    // For localStorage.
    get local() {
      return getResponseObj(request$, runStreamAdapter)
    },
    // For sessionStorage.
    get session() {
      return getResponseObj(request$, runStreamAdapter, 'session')
    },
  }
}
