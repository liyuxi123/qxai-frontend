import { QxAIConsulationHttp } from '@/utils/axios/index';

export const getPromptdata = () => {
  // 发送一个空对象作为请求体
  return QxAIConsulationHttp.get('/aiqa/getSystemConfigList', {});
};


export const updateSystemConfig = (data) => {
  return QxAIConsulationHttp.post('/aiqa/updateSystemConfig', data);
};




