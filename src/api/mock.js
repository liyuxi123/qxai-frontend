import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import user from './mockServeData/user'

import testApi from './testServer/mockServerData/testMockData'

import metricsMockData from './metricsServer/mockData/metricsMockData'
import loginMockData from './loginServer/mockData/permission'
import promptServer from "@/api/AIServer/PromptData";

import thridMetricsMockData from './metricsServer/ThridMetrics/ThridMetricsMockData'

import dateMockData from './metricsServer/dateData/dateMockData'

// 定义mock请求拦截
Mock.mock('/api/home/getData', homeApi.getStatisticalData)

// 用户列表的数据
Mock.mock('/api/user/add', 'post', user.createUser)
Mock.mock('/api/user/edit', 'post', user.updateUser)
Mock.mock('/api/user/del', 'post', user.deleteUser)
// 根据后端的接口文档 模拟出的数据
Mock.mock(/api\/users\/getUser/, user.getUserList)
//test 拦截
Mock.mock('/test/patient/searchDept', 'post', testApi.getDeptListByPost);
Mock.mock(/\/test\/patientInfo\/searchDept\?*/, 'get', testApi.getDeptListByGet);


//百度AI文本对话ernie-speed-128k模型

//
//

// //login模块 拦截
 Mock.mock('/api/login/getMenu', 'post', loginMockData.getMenu)
// //
// //metrics模块 拦截
// Mock.mock('/api/metrics/searchMetricsList', 'post', metricsMockData.searchMetrics);
// Mock.mock('/api/metrics/updateMetrics', 'post', metricsMockData.updateMetric);
// Mock.mock('/api/metrics/deleteMetrics', 'post', metricsMockData.deleteMetric);

////  // 获取指标类型数据【三甲，国考等】
// Mock.mock(/\/api\/metrics\/metricsType\?*/, 'get', metricsMockData.metricsTypeData);
// Mock.mock('/api/metrics/getMetricsByIndId', 'post', metricsMockData.getMetricByIndId);
 // Mock.mock('/api/metrics/runSql', 'post', metricsMockData.runSql);
//
// //sql执行结果
//
//

// //指标时间获取
 //Mock.mock('/api/metrics/getMetrcisDate', 'post', dateMockData.getMetrcisDate)
// //三甲指标获取
 //Mock.mock('/api/metrics/getThridMetrics', 'post', thridMetricsMockData.getThridMetrics)
 //Mock.mock('/api/metrics/getDeptThridMetrics', 'post', thridMetricsMockData.getDeptThridMetrics)

// //获取指标备注
//Mock.mock('/api/metrics/getMetricsRemarkByIndId', 'post', metricsMockData.getMetricsRemarkByIndId);
//更新或者插入指标备注
//Mock.mock('/api/metrics/updateMetricsRemark', 'post', metricsMockData.updateMetricsRemark);
///删除指标备注
//Mock.mock('/QxAIConsulation/metrics/deleteRemarkByIndId', 'post', metricsMockData.deleteRemarkByIndId);

//Mock.mock('/QxAIConsulation/aiqa/getSystemConfigList', 'post', promptServer.getPromptdata);


