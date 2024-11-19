import { testHttp } from '@/utils/axios/index';



// 定义 searchDept 函数，使用 POST 请求，传递分页参数
export const searchDeptPost = (page = 1, pageSize = 10) => {
  return testHttp.post('/test/patientInfo/searchDept', {
    page,
    pageSize
  });
};



// 定义 searchDept 函数，使用 get 请求，传递分页参数
export const searchDeptGet = (page = 1, pageSize = 10) => {
  return testHttp.get(`/test/patientInfo/searchDept`, {
    params: {
      page,
      pageSize
    }
  });
};
