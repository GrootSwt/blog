<template>
  <el-container class="layout-style">
    <!--侧边菜单栏-->
    <el-aside :width="asideWidth" v-if="hasAsideMenu">
      <el-menu ref="asideMenuRef" :default-active="$route.path" :collapse="isCollapse" :unique-opened="true" router
               class="el-menu-vertical">
        <template v-for="menu in menuList">
          <el-submenu :index="menu.location" v-if="menu.children.length > 0" :key="menu.id">
            <!--多级菜单中的一级菜单-->
            <template slot="title">
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.title }}</span>
            </template>
            <!--除一级菜单外的其他级菜单-->
            <el-menu-item-group>
              <template v-for="subMenu in menu.children">
                <aside-menu :menu="subMenu" :key="subMenu.id"></aside-menu>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header-menu">
        <!--菜单折叠按钮-->
        <div class="menu-system-logo">
          <i :class="collapseClass"
             v-if="hasAsideMenu"
             @click="changeCollapse"/>
        </div>
        <!--头部菜单-->
        <el-menu :default-active="$route.path" mode="horizontal" router>
          <el-menu-item v-for="menu in menuList" :key="menu.id" :index="menu.location" @click="closeAsideMenu(menu)">
            <i :class="menu.icon"></i>
            {{ menu.title }}
          </el-menu-item>
        </el-menu>
        <!--登录信息-->
        <login-info class="login-info"></login-info>
      </el-header>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-style">
        <el-breadcrumb-item :key="index" v-for="(title, index) in $route.meta.breadcrumb">
          {{ title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-main class="main-box">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import LoginInfo from '@/views/Layout/LoginInfo'
import { getCookie } from '@/utils/cookies'
import AsideMenu from '@/views/Layout/AsideMenu'

export default {
  name: 'layout',
  components: {
    AsideMenu,
    LoginInfo
  },
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapState('menu', {
      menuList: state => state.menuList
    }),
    collapseClass () {
      return this.isCollapse ? ['menu-logo', 'el-icon-s-unfold', 'menu-logo-after'] : ['menu-logo', 'el-icon-s-unfold']
    },
    asideWidth () {
      return this.isCollapse ? '65' : '200'
    },
    hasAsideMenu () {
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].children.length !== 0) {
          return true
        }
      }
      return false
    }
  },
  created () {
    // 初始化或者刷新时，从cookie中取出用户信息，然后存放到vuex中
    // 然后获取菜单和操作权限
    const userInfo = JSON.parse(getCookie('userInfo'))
    this.setLoginUserInfo(userInfo)
    this.getMenuList()
  },
  methods: {
    ...mapMutations('menu', ['setMenuList']),
    ...mapMutations('user', ['setLoginUserInfo']),
    ...mapActions('menu', ['getMenuList']),
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击头部菜单,关闭所有侧边栏菜单
    closeAsideMenu (menu) {
      if (menu.children.length === 0) {
        const menuArr = this.menuList.filter(item => item.children.length > 0)
        menuArr.forEach(menu => {
          this.$refs.asideMenuRef.close(menu.location)
        })
      }
    }
  }
}
</script>

<style scoped>
.layout-style {
  width: 100%;
  height: 100%;
}

.header-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-info {
  margin-right: 20px;
  position: relative;
  float: right;
}

/*系统图标样式*/
.menu-system-logo {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

/*面包屑样式*/
.breadcrumb-style {
  margin: 12px 18px;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

/*缩放图标*/
.menu-logo {
  margin-left: 10px;
  font-size: 25px;
  transition: transform .5s;
}

/*菜单缩放按钮旋转*/
.menu-logo-after {
  transform: rotate(-180deg);
}

/*取消侧边菜单栏X轴方向出现滚动条*/
.el-aside {
  overflow-x: hidden;
}

/*设置侧面菜单栏缩放动画效果时间*/
.horizontal-collapse-transition {
  transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
}

/*更改侧边菜单栏滚动条样式*/
.el-aside::-webkit-scrollbar {
  width: 5px;
}

.el-aside::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.2);
}

.el-aside::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}

.main-box {
  margin-bottom: 12px;
}
</style>
