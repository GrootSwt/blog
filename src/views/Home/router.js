export default {
  path: 'home',
  name: 'Home',
  component: () => import('@/views/Home/index'),
  meta: {
    title: '主页',
    auth: true
  }
}
