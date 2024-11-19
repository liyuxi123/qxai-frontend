<template>
  <div class="iframe-container">
    <iframe
      src="/static/index/qxindex.html"
      ref="iframe"
      style="width: 100%; height: 100%; border: none; overflow: auto;"
      scrolling="auto">
    </iframe>
  </div>
</template>

<script>
export default {
  methods: {
    adjustIframeHeight() {
      // 此方法保留，因为如果有其他需要可以继续使用
    }
  }
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 90vh; /* 固定父容器高度 */
  overflow: hidden; /* 父容器本身不滚动 */
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  overflow: auto; /* 允许 iframe 内容超出时显示滚动条 */
}
</style>
