<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <common-aside/>
      </el-aside>
      <el-container>
        <el-header>
          <common-header/>
        </el-header>
        <el-main class="no-padding">
          <!-- 路由出口 -->
          <!-- 路由匹配到的组件将渲染在这里 -->
          <keep-alive :include="['user','ZhuYuanMain','ThridMetrics','MetricsManger','NationMetrics']">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'

export default {
  name: 'Main',
  data() {
    return {}
  },
  components: {
    CommonAside,
    CommonHeader

  }
}
</script>
<style scoped>
.el-header {
  padding: 0
}

.no-padding {
  padding: 0 !important; /* 确保去除内边距 */
}

</style>