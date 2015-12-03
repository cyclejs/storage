import getResponseObj from './util'

export default function(request$) {
  return {
    // For localStorage.
    get local() {
      return getResponseObj(request$)
    },
    // For sessionStorage.
    get session() {
      return getResponseObj(request$, `session`)
    },
  }
}
