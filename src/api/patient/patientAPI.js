import {apiHttp} from  '@/utils/axios/index'


//获取病人
export const  patientSearch = (pageNum = 1, pageSize = 20,searchQuery='',deptCode='',startTime='',endTime='') => {
  return apiHttp.post('/patientInfo/search', {
    pageNum,
    pageSize,
    searchQuery,
      deptCode,
      startTime,
      endTime
  });
};
//获取科室
export const  getDeptList = () => {
  return apiHttp.get('/patientInfo/searchDept');
};


//获取病历
export const  getEmr = (patientId='') => {
  return apiHttp.post('/patientInfo/searchEmr',{
    patientId
  });
};


//手术
export const  searchOperate = (patientId='') => {
  return apiHttp.post('/patientInfo/searchOperate',{
    patientId
  });
};


//诊断
export const  searchDiagnosis = (patientId='') => {
  return apiHttp.post('/patientInfo/searchDiagnosis',{
    patientId
  });
};
//医嘱
export const  searchAdvice = (patientId='') => {
  return apiHttp.post('/patientInfo/searchAdvice',{
    patientId
  });
};

//检查
export const  searchInspect = (patientId='') => {
  return apiHttp.post('/patientInfo/searchInspect',{
    patientId
  });
};


