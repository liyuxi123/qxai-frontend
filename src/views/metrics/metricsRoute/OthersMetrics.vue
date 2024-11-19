<template>
  <div>
    <ExportHtml ref="exportHtmlComponent"/>
    <el-button @click="ExportHtml" :loading="ExportHtmlLoading">导出</el-button>
    </div>
</template>

<script>
import ExportHtml from '@/components/ExportHtml.vue';

export default {
  components: {
    ExportHtml
  },
  data() {
    return {
      ExportHtmlLoading: false // 导出按钮的加载状态
    };
  },
  methods: {
    ExportHtml() {
      let indIdList=["bn240300101","bn2403024", "bn240300101"]
      this.ExportHtmlLoading = true;  // 启动加载状态
      this.$refs.exportHtmlComponent.exportHtml(indIdList).finally(() => {
        // 延迟 5 秒后恢复按钮
        setTimeout(() => {
          this.ExportHtmlLoading = false;  // 恢复按钮状态
        }, 4000); // 5000 毫秒 = 5 秒
      });
    },
  }
};
</script>
