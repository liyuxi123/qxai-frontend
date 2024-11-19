<template>
  <el-menu
     :default-active="activeIndex"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="white"
    text-color="black"
    active-text-color="black"
  >

  <h3><img src="@/assets/qxyl_logo.png" alt="Logo" style="width: 35px; height: 35px; margin-top: 5px;"/>{{ isCollapse ? "" : "全息数据" }}</h3>
  <!-- 一级菜单项 -->
    <el-menu-item
      @click="clickMenu(item)"
      v-for="item in noChildren"
      :key="item.name"
      :index="item.path"
    >
<!--      <i :class="`el-icon-${item.icon}`"></i>-->
         <i v-if="isCollapse" class="el-icon-caret-right"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>

     <!-- 子菜单 -->
    <el-submenu
      v-for="item in hasChildren"
      :key="item.label"
      :index="item.path || item.label"
    >
      <template slot="title">
<!--        <i :class="`el-icon-${item.icon}`"></i>-->
           <i v-if="isCollapse" class="el-icon-caret-right"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
         <!-- 子菜单的 menu-item-group -->
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        <el-menu-item
            @click="clickMenu(subItem)"
           :index="subItem.path || subItem.label"
        >{{
          subItem.label
        }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import Cookie from "js-cookie";
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    // 点击菜单
    clickMenu(item) {
     console.log("item",item)
      // 当页面的路由与跳转的路由不一致才允许跳转
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path);
      }
         this.$store.commit("selectMenu", item);
    },
  },
  computed: {

        // 动态获取当前激活的菜单项
    activeIndex() {
      // 查找当前路由路径对应的菜单项，无论是一级菜单还是子菜单
      const findMenuItem = (menuItems) => {
        for (const item of menuItems) {
          if (item.path === this.$route.path) return item;
          if (item.children) {
            const childItem = findMenuItem(item.children);
            if (childItem) return childItem;
          }
        }
        return null;
      };

      const activeItem = findMenuItem(this.menuData);
      return activeItem ? activeItem.path : '';
    },
    // 没有子菜单
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    // 有子菜单
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
    menuData() {
      // 判断当前数据,如果缓存中没有,当前store中去获取
      return JSON.parse(Cookie.get("menu")) || this.$store.state.tab.menu;
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
}
   /* 子菜单 */
  .el-submenu .el-menu-item{
    min-width: 110px;
  }
.el-menu {
  height: 100vh;
  h3 {
    color: black;
    text-align: left;
    line-height: 48px;
    font-size: 16px;

  }
}

.el-menu {
  color: black;
  border-right: none;
}

  /* 选中时的背景色修改 */
  .el-menu-item.is-active {
    background-color: #dadada !important; /* 选中菜单项的背景色为黑色 */
  color: black !important;            /* 选中菜单项的文字颜色为白色 */
  text-decoration: underline;         /* 给选中的菜单项添加下划线 */
  }


.el-menu-item-group .el-menu-item {
  display: flex;
 margin-left: 3px; /* 向右移动文字，您可以根据需要调整这个值 */
}







</style>