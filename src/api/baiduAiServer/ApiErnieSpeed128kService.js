
import { aiHttp } from '@/utils/axios/index'; // 根据你定义的路径调整

const apiService = {
  accessToken: '',

  // 获取 Access Token
  async getAccessToken(apiKey, secretKey) {
    if (!this.accessToken) {
      const response = await aiHttp.post(
        `/oauth/2.0/token`,
        `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      this.accessToken = response.data.access_token;
    }
    return this.accessToken;
  },

  // 发送 API 请求
  async sendRequest(messages = []) {
    try {

      const accessToken = await this.getAccessToken(process.env.VUE_APP_BAIDU_API_AI_KEY,  process.env.VUE_APP_BAIDU_API_AI_SECRETKEY);

      const response = await aiHttp.post(
        `/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-128k?access_token=${accessToken}`,
        {
          messages: messages,  // 传入的消息
          temperature: 0.8,
          top_p: 0.8,
          penalty_score: 1,
          disable_search: false,
          enable_citation: false,
          collapsed: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('请求失败', error);
      throw error;
    }
  }
};

export default apiService;
