import Cookies from 'js-cookie'

// 根据key获取Cookie
export function getCookie (key) {
  return Cookies.get(key)
}

// 设置Cookie
export function setCookie (key, value, option = {}) {
  Cookies.set(key, value, option)
}

// 根据key删除Cookie
export function removeCookie (key) {
  Cookies.remove(key)
}
