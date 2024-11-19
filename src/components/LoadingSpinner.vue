<template>
  <div v-if="visible" class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 40 // 可调整加载动画的大小
    }
  }
};
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* 相对定位，避免覆盖全屏 */
  height: 100%; /* 可以根据外部容器调整高度 */
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: black;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
