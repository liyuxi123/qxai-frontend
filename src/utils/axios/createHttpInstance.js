import axios from 'axios';

export const createHttpInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000, // 超时时间
  });

  instance.interceptors.request.use(function (req) {
    const token = localStorage.getItem('authToken');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  }, function (error) {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  return instance;
};
