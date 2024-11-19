<template>
  <div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <iframe
      v-else
      :src="qxcollectUrl"
      ref="iframe"
      @load="handleIframeLoad"
      @error="handleIframeError"
      style="width: 100%; height: calc(100vh - 70px); border: none;"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qxcollectUrl: process.env.VUE_APP_QXCOLLECT_URL,
      errorMessage: '' // 用于存储错误信息
    };
  },
  mounted() {
    this.updateIframeHeight();
    window.addEventListener('resize', this.updateIframeHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateIframeHeight);
  },
  methods: {
    updateIframeHeight() {
      const iframe = this.$refs.iframe;
      iframe.style.height = `calc(${window.innerHeight}px - 70px)`; // 减去一些像素来避免滚动条
    },
    handleIframeLoad() {
      // 如果成功加载，清除错误信息
      this.errorMessage = '';
    },
    handleIframeError() {
      // 如果加载失败，设置错误信息
      this.errorMessage = '无法加载数据采集监控'+process.env.VUE_APP_QXCOLLECT_URL;
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 16px;
  text-align: center;
  padding: 20px;
}
</style>
