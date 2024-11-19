<template>
  <div>

    <div >
      <el-button size="small" @click="addTab">
        add tab
      </el-button>
    </div>
    <!-- 其他 MetricsDialog 的内容 -->
  </div>
</template>

<script>
export default {
  methods: {
    addTab() {
      this.$emit('add-tab'); // 触发父组件的 addTab 方法
    }
  }
};
</script>

<style scoped>
/* 你可以在这里添加自定义的样式 */
</style>
