import store from '@/store'
// 权限校验
export default function (auth) {
  if (!auth) {
    return false
  }
  const authList = store.getters['menu/getAuthorities']
  for (const a of authList) {
    if (a === auth) return true
  }
  return false
}
