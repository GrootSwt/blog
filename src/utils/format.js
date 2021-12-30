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

export function formatDate (timestamp, format = 'yyyy-MM-dd') {
  return timestampToStr(timestamp, format)
}

export function formatTime (timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
  return timestampToStr(timestamp, format)
}
