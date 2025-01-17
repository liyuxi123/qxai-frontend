<template>
  <div>
    <button @click="startRecording">开始录音</button>
    <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      socket: null, // WebSocket实例
    };
  },
  methods: {
    async startRecording() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("当前浏览器不支持音频捕获功能");
        return;
      }

      try {
        // 获取音频流
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 创建 MediaRecorder
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

        // WebSocket 初始化
        this.socket = new WebSocket("ws://你的后端WebSocket地址");
        this.socket.onopen = () => {
          console.log("WebSocket连接成功");
        };
        this.socket.onerror = (err) => {
          console.error("WebSocket连接失败", err);
        };

        // 处理音频分片
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.sendAudioChunk(event.data);
          }
        };
        // 开始录制
        this.mediaRecorder.start(100); // 每 100ms 生成一段音频
        this.isRecording = true;
        console.log("开始录音...");
      } catch (error) {
        console.error("录音启动失败", error);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        console.log("录音停止");
      }
      if (this.socket) {
        this.socket.close();
        console.log("WebSocket关闭");
      }
    },
    sendAudioChunk(chunk) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // 将音频数据通过 WebSocket 发送到后端
        this.socket.send(chunk);
        console.log("发送音频数据:", chunk);
      }
    },
  },
};
</script>
