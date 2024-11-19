<template>
  <div class="header-container">
    <div class="l-content">
      <el-button
        style="margin-right: 20px"
        @click="handleMenu"
        icon="el-icon-arrow-left"
        size="mini"
      ></el-button>

          <el-tag
            v-for="(item, index) in tags"
            :key="item.path"
            :closable="item.name !== 'home'"
            :effect="$route.name === item.name ? 'dark' : 'plain'"
            @click="changeMenu(item)"
            @close="handleClose(item, index)"
            size="medium"
            type="info"
            >
            {{ item.label }}
        </el-tag>


    </div>
    <div class="r-content">
         <!-- 添加文字 "用户" -->
           <span class="user-label">{{ user }}</span>
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link">
          <img class="user" src="../assets/images/user.png" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Cookie from "js-cookie";
export default {
      name: 'CommonTag',
  data() {
    return {};
  },
  methods: {

    handleMenu() {
     // console.log("item")
      this.$store.commit("collapseMenu");
    },
    handleClick(command) {
      if (command === "cancel") {
        // 清除cookie中的token
        Cookie.remove("token");
        // 清除cookie中的menu
        Cookie.remove("menu");
        // 跳转到登录页
        this.$router.push("/login");
      }
    },
       ...mapMutations(['closeTag']),
        // 点击tag跳转的功能
        changeMenu(item) {
            console.log("点击tag跳转的功能item",this.$route.name)
             if (this.$route.name === item.name) {
            return;
        }
          this.$router.push({ name: item.name })
        },
        // 点击tag删除的功能
        handleClose(item, index) {
            // 调用store中的mutation
            this.closeTag(item)
            const length = this.tags.length
            // 删除之后的跳转逻辑
            if (item.name !== this.$route.name) {
                return
            }
            // 表示的是删除的最后一项
            if (index === length) {
                this.$router.push({
                    name: this.tags[index - 1].name
                })
            } else {
                this.$router.push({
                    name: this.tags[index].name
                })
            }
        },
  },
  computed: {
                ...mapState({
             tags: state => state.tab.tabsList,
                   }),
               ...mapState({
             user: state => state.user.user
                      })
  },
  created() {
    this.$store.commit("loadTabsList"); // 加载 Cookie 中的 tabsList 数据
     this.$store.commit("loadUser"); //加载 Cookie 中的 用户数据


  },
};
</script>
<style lang="less" scoped>
.header-container {
  padding: 0 0px;
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }

  .r-content {
    display: flex;
    align-items: center; /* 确保子元素垂直居中 */

    .user-label {
      font-size: 20px; /* 根据需要调整字体大小 */
      color: #333; /* 根据需要调整字体颜色 */
      margin-right: 10px; /* 控制文字和下拉菜单之间的间距 */
      display: flex;
      align-items: center; /* 垂直居中对齐文字 */
    }

    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .l-content {
    display: flex;
    align-items: center;

    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;

        &.is-link {
          color: #666;
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: #fff;
        }
      }
    }
  }

  .tabs {
    padding: 20px;

    .el-tag {
      margin-right: 15px;
      cursor: pointer;
      background: black;
    }
  }
}
</style>
