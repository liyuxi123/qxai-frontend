import {apiHttp} from  '@/utils/axios/index'


export const getMenu = (data) => {
    return apiHttp.post('/login/getMenu', data)
}