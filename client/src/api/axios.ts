import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const accessTokenString = localStorage.getItem('accessToken');
    const accessToken = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;

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
let refresh = false;

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  async (error) => {
    console.log('Error', error);

    const originalRequest = error.config;
    if (
      (error.response.status === 401 && !refresh) ||
      (error.response.status === 500 && !refresh)
    ) {
      refresh = true;

      console.log('Token expired');
      try {
        const response = await api.post(
          '/user/refresh',
          {},
          {
            withCredentials: true,
          }
        );
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', JSON.stringify(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return await api(originalRequest);
      } catch (err) {
        console.log('Error:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
