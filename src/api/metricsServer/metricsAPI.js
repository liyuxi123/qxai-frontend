import {apiHttp} from '@/utils/axios/index'

//获取指标列表
export const searchMetrics = (searchQuery = '', currentPage = 1, pageSize = 20) => {
    return apiHttp.post('/metrics/searchMetricsList', {
        searchQuery,
        currentPage,
        pageSize
    });
};


// 获取指标类型数据
export const getMetricsTypeData = () => {
    return apiHttp.get('/metrics/metricsType');
};

//保存指标数据（编辑和新增）
export const updateMetric = (metricData, sqlType) => {
    return apiHttp.post('/metrics/updateMetrics', {
        metricData: {
            ...metricData // 将 metricData 中的字段展开到 metricData 对象中
        },
        sqlType // 直接将 sqlType 添加到请求体中
    });
};

//删除指标
export const deleteMetric = (sid) => {
    return apiHttp.post('/metrics/deleteMetrics', {
        sid // 将需要删除的 sid 传递给后端
    });
};

export const getMetricByIndId = (indId) => {
    return apiHttp.post('/metrics/getMetricsByIndId', {
        indId // 将要查找的 sid 传递给后端
    });
};


export const getThridMetrics = (year = '', month = '', quarter = '', stage = '') => {
    return apiHttp.post('/metrics/getThridMetrics', {
        year, month, quarter, stage,
    });
};

export const getMetrcisDate = () => {
    return apiHttp.post('/metrics/getMetrcisDate');
};


export const runSql = (sql = '', currentPage = 1, pageSize = 20) => {
    return apiHttp.post('/metrics/runSql', {
        sql,
        currentPage,
        pageSize
    });
};


export const getDeptThridMetrics = (dataId = '', year = '', month = '', quarter = '', stage = '') => {
    return apiHttp.post('/metrics/getDeptThridMetrics', {
        dataId,
        year,
        month,
        quarter,
        stage,
    });
}


export const getMetricsRemarkByIndId = (options) => {
    return apiHttp.post('/metrics/getMetricsRemarkByIndId', options);
};



export const updateMetricsRemark = (options) => {
    return apiHttp.post('/metrics/updateMetricsRemark', options);
};


export const deleteRemarkByIndId = (options) => {
    return apiHttp.post('/metrics/deleteRemarkByIndId', options);
};


//获取备注（参数为数组）
export const getMetricsRemarkByIndIdList = (options) => {
    return apiHttp.post('/metrics/getMetricsRemarkByIndIdList', options);
};