const FLAG = 'krn_auth'

export function checkPassword(password) {
  const expected = import.meta.env.VITE_APP_PASSWORD
  const ok = password === expected
  if (ok) sessionStorage.setItem(FLAG, '1')
  return ok
}

export function isLoggedIn() {
  return sessionStorage.getItem(FLAG) === '1'
}

export function logout() {
  sessionStorage.removeItem(FLAG)
}
