export default function(request$) {
  const local$ = request$.filter((req) => !req.target || req.target === `local`)
  const session$ = request$.filter((req) => req.target === `session`)

  return {
    // For localStorage.
    local: {
      key(n) {
        // Function returning Observable of the nth key.
        return local$
          .filter((req) => req.key === localStorage.key(n))
          .map((req) => req.key)
          .startWith(localStorage.key(n))
          .distinctUntilChanged()
      },
      // Function returning Observable of item values.
      getItem(key) {
        const initialValue = localStorage.getItem(key)

        const value$ = local$
          .filter((req) => req.key === key)
          .map((req) => req.value)

        if (initialValue) {
          return value$.startWith(initialValue)
        } else {
          return value$
        }
      },
    },
    // For sessionStorage.
    session: {
      // Function returning Observable of the nth key.
      key(n) {
        return session$
          .filter((req) => req.key === sessionStorage.key(n))
          .map((req) => req.key)
          .startWith(sessionStorage.key(n))
          .distinctUntilChanged()
      },
      // Function returning Observable of values.
      getItem(key) {
        const initialValue = sessionStorage.getItem(key)

        const value$ = session$
          .filter((req) => req.key === key)
          .map((req) => req.value)

        if (initialValue) {
          return value$.startWith(initialValue)
        } else {
          return value$
        }
      },
    },
  }
}
