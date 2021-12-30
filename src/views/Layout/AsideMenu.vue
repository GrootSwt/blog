<template>
  <div>
    <template v-if="menu.children.length === 0">
      <el-menu-item :index="menu.location" :key="menu.id">
        <i :class="menu.icon"></i>
        {{ menu.title }}
      </el-menu-item>
    </template>
    <template v-else>
      <el-submenu :index="menu.location" :key="menu.id">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span slot="title">{{ menu.title }}</span>
        </template>
        <el-menu-item-group>
          <template v-for="subMenu in menu.children">
            <aside-menu :menu="subMenu" :key="subMenu.id"></aside-menu>
          </template>
        </el-menu-item-group>
      </el-submenu>
    </template>
  </div>
</template>

<script>

export default {
  name: 'AsideMenu',
  props: ['menu']
}
</script>

<style scoped>

</style>
