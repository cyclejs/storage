import getResponseObj from './util'

export default function(request$, runStreamAdapter) {
  return {
    // For localStorage.
    get local() {
      return getResponseObj(request$, runStreamAdapter)
    },
    // For sessionStorage.
    get session() {
      return getResponseObj(request$, runStreamAdapter, `session`)
    },
  }
}
