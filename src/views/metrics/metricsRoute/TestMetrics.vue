<template>
  <div>
    <h1>语音识别结果</h1>
    <p>{{ recognitionResult }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recognitionResult: '',
    };
  },
  created() {
    this.connectWebSocket();
  },
  methods: {
    connectWebSocket() {
      const socket = new WebSocket("ws://192.168.66.105:6899/audioBulk");
      socket.onmessage = (event) => {
        this.recognitionResult = event.data; // 更新识别结果
      };
      socket.onopen = () => {
        console.log("WebSocket connected!");
      };
      socket.onclose = () => {
        console.log("WebSocket disconnected!");
      };
    },
  },
};
</script>

<style>
h1 {
  color: #42b983;
}
</style>
