import { createHttpInstance } from '../../utils/axios/createHttpInstance'; // 根据你定义的路径调整

const apiHttp = createHttpInstance(process.env.VUE_APP_BASE_API_URL);
const authHttp = createHttpInstance(process.env.VUE_APP_BASE_API_URL);





// 请求首页数据
export const getData = () => {
    // 返回一个promise对象
    return apiHttp.get('/home/getData')
}

export const getUser = (params) => {
    // console.log(params);

    // 返回用户列表
    // axios 请求
    // return http.get('/users/getUser', params)
    // 后端的路径出来了 请求不就是的 
    return apiHttp.get('/users/getUser', params)
    // return http.get('http://localhost:9000/api/users/getUser', params)
}

export const addUser = (data) => {
    return apiHttp.post('/user/add', data)
}

export const editUser = (data) => {
    return apiHttp.post('/user/edit', data)
}

export const delUser = (data) => {
    return apiHttp.post('/user/del', data)
}



export const getTest = () => {
    // 返回一个promise对象
    return authHttp.get('/patientInfo/searchDept')
}