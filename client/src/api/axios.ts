import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const accessTokenString = localStorage.getItem('accessToken');
    const accessToken = accessTokenString;

    if (accessToken) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
