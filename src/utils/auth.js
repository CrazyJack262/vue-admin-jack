import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_jack_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, 'Bearer ' + token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRoutes() {
  return
}
