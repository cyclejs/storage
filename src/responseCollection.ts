import getResponseObj, { ResponseObject } from './util'

export interface ResponseCollection
{
  local : ResponseObject
  session : ResponseObject
}

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
