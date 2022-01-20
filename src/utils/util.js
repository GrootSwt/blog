import store from '@/store'
import Cookies from 'js-cookie'

// 操作权限校验
export function verify (code) {
  if (!code) {
    return false
  }
  const authList = store.getters['menu/getAuthorities']
  for (const a of authList) {
    if (a === code) return true
  }
  return false
}

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

function timestampToStr (timestamp, format) {
  const date = new Date(timestamp)
  const getTwo = (i) => {
    return i < 10 ? '0' + i : '' + i
  }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (i) => {
    switch (i) {
      case 'yyyy':
        return getTwo(date.getFullYear())
      case 'MM':
        return getTwo(date.getMonth() + 1)
      case 'dd':
        return getTwo(date.getDate())
      case 'HH':
        return getTwo(date.getHours())
      case 'mm':
        return getTwo(date.getMinutes())
      case 'ss':
        return getTwo(date.getSeconds())
    }
  })
}

// 时间戳转字符串日期
export function formatDate (timestamp, format = 'yyyy-MM-dd') {
  return timestampToStr(timestamp, format)
}

// 时间戳转字符串日期加时间
export function formatTime (timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
  return timestampToStr(timestamp, format)
}

/*
* 格式化长度
* 格式化规则如下
* 如果是number类型，不大于100为百分比，大于100为单位为px的长度
* 如果是字符串类型，默认单位px，可以使用其他任何单位
* */
export function formatLength (l) {
  if (!l) return null
  if (typeof l === 'number') {
    if (l > 0 && l <= 100) {
      return l + '%'
    } else if (l > 100) {
      return l + 'px'
    }
  }
  if (typeof l === 'string') {
    if (isNaN(Number(l))) {
      return l
    } else {
      return l + 'px'
    }
  }
}
