<template>
  <div>
    <button @click="sendRequest">发送请求</button>
    <div v-if="responseData">
      <h3>响应数据:</h3>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script>
import baiduAiServer from '@/api/baiduAiServer/ApiErnieSpeed128kService';

export default {
  data() {
    return {
      responseData: null,
      messages: [
             {
               "role": "user",
               "content": "中国,",
              },
            ]
    };
  },
  methods: {
    async sendRequest() {
      try {
        // 使用提取出来的服务发送请求
        this.responseData = await baiduAiServer.sendRequest(
         this.messages// 根据实际需求传入 messages
        );
      } catch (error) {
        console.error('请求失败', error);
      }
    }
  }
};
</script>
