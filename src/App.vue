<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  created () {},
  methods: {}
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}

#nprogress .bar {
  background-color: #67c23a !important;
  height: 1px !important;
}
</style>
