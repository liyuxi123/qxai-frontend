import { createHttpInstance } from './createHttpInstance'; // 你定义的工厂函数


const apiHttp = createHttpInstance(process.env.VUE_APP_BASE_API_URL);  //主程序

const aiHttp = createHttpInstance(process.env.VUE_APP_BAIDU_API_AI_URL);  //AI百度

const testHttp = createHttpInstance(process.env.VUE_APP_TEST_API_TEST_URL);  //测试





export {aiHttp, testHttp,apiHttp};
