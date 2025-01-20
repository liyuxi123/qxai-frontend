<template>
  <div>
    <button @click="startRecognition">开始语音识别</button>
    <p>识别结果：{{ result }}</p> <!-- 展示识别结果 -->
  </div>
</template>

<script>
function generateUUID() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
  );
}

export default {
  data() {
    return {
      ws: null,
      sn: '',
      result: '',  // 用于存储识别结果
      sentenceList: [], // 存储已完成的句子
      lastResult: '' // 上一个中间结果
    };
  },
  methods: {
    // 获取WebSocket URL
    async getWebSocketUrl() {
      this.sn = generateUUID();
      const wsUrl = `ws://vop.baidu.com/realtime_asr?sn=${this.sn}`;
      return wsUrl;
    },

    // 发送启动帧
    sendStartFrame() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const startFrame = {
          type: 'START',
          data: {
            appid: 117006901,
            appkey: 'Cl3BupsIlLkC0Ue5ONS6darY',
            dev_pid: 15372, // 中文普通话
            lm_id: null,
            cuid: 'cuid-1',
            format: 'pcm',
            sample: 16000,
          },
        };
        this.ws.send(JSON.stringify(startFrame));
      }
    },

    // 开始语音识别
    async startRecognition() {
      try {
        const wsUrl = await this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
          console.log('WebSocket 连接成功');
          this.sendStartFrame();
          this.startMicStreaming();
        };

        this.ws.onmessage = (event) => {
          console.log('识别结果:', event.data);
          const message = JSON.parse(event.data);

          console.log("================",message.result)

          if (message && message.result) {
            // 判断是中间结果还是完整结果
            if (message.type === "MID_TEXT") {
              // 中间结果时，将当前的部分结果与上一个中间结果拼接
              this.currentMidResult = message.result;
              // 只显示当前的中间结果
              this.result = this.sentenceList.join(' ') + ' ' + this.currentMidResult;
            } else if (message.type === "FIN_TEXT") {
              // 如果是完整句子，将当前句子添加到 sentenceList
              this.sentenceList.push(message.result);
              // 更新结果显示为所有完成的句子
              this.result = this.sentenceList.join(' ');
              console.log('当前完成的识别结果:', this.result);
              // 清空当前的中间结果
              this.currentMidResult = '';
            }
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket 错误:', error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket 连接关闭');
        };
      } catch (error) {
        console.error('WebSocket 初始化失败:', error);
      }
    },

    // 在麦克风流处理时进行采样率转换并发送到 WebSocket
    async startMicStreaming() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('浏览器不支持麦克风流采集');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 获取音频流的采样率
        const sampleRate = audioContext.sampleRate;
        if (sampleRate !== 16000) {
          console.warn(`当前音频采样率为 ${sampleRate}Hz，可能与服务端要求不一致`);
        }

        // 创建 MediaStreamSource 和 ScriptProcessorNode
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1); // 4096 为缓冲区大小

        // 处理音频数据
        processor.onaudioprocess = (event) => {
          const inputBuffer = event.inputBuffer.getChannelData(0); // 获取音频数据（Float32Array）

          // 如果采样率不是 16000 Hz，进行重采样
          let processedBuffer = inputBuffer;
          if (sampleRate !== 16000) {
            processedBuffer = this.resampleAudio(inputBuffer, sampleRate, 16000);
          }

          // 将音频数据转换为 Int16 格式并发送到 WebSocket
          const int16ArrayBuffer = this.float32ToInt16(processedBuffer);
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(int16ArrayBuffer); // 发送二进制数据
          } else {
            console.warn('WebSocket 连接已断开，无法发送音频数据');
          }
        };

        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination); // 激活音频处理链
        console.log('麦克风音频处理已启动');
      } catch (error) {
        console.error('麦克风访问失败:', error);
      }
    },

    // 手动重采样函数
    resampleAudio(inputBuffer, originalSampleRate, targetSampleRate) {
      const resampledLength = Math.round(inputBuffer.length * targetSampleRate / originalSampleRate);
      const resampledBuffer = new Float32Array(resampledLength);

      for (let i = 0; i < resampledLength; i++) {
        const sampleIndex = i * originalSampleRate / targetSampleRate;
        const sampleIndexInt = Math.floor(sampleIndex);
        const fractionalPart = sampleIndex - sampleIndexInt;

        // 线性插值
        if (sampleIndexInt + 1 < inputBuffer.length) {
          resampledBuffer[i] = inputBuffer[sampleIndexInt] * (1 - fractionalPart) +
              inputBuffer[sampleIndexInt + 1] * fractionalPart;
        } else {
          resampledBuffer[i] = inputBuffer[sampleIndexInt];
        }
      }

      return resampledBuffer;
    },

    // 将 Float32 数据转换为 Int16 数据
    float32ToInt16(buffer) {
      const int16Array = new Int16Array(buffer.length); // 创建 Int16Array
      for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, buffer[i])); // 限制在 [-1, 1] 范围内
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff; // 转换为 Int16 格式
      }
      return int16Array.buffer; // 返回 ArrayBuffer 格式，以便发送 WebSocket
    },
  },
};
</script>

<style scoped>
/* 样式代码 */
</style>
