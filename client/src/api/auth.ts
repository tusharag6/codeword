import { AxiosResponse } from 'axios';
import type { TLoginSchema } from '@/components/LoginCard';
import type { TRegisterSchema } from '@/components/RegisterCard';
import api from './axios';

export const refresh = async (): Promise<string | null> => {
  // console.log('Refreshing token!');
  try {
    const { data } = await api.post('/user/refresh', {});
    if (data.success === false) {
      return null;
    }
    if (data.accessToken !== undefined) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const login = async (formData: TLoginSchema): Promise<TLoginSchema> => {
  try {
    const response: AxiosResponse = await api.post('/user/login', formData, {
      withCredentials: true,
    });
    const responseData = response.data;
    localStorage.setItem('accessToken', JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const registerUser = async (
  formData: TRegisterSchema
): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post('/user/register', formData);
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post('/user/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  } catch (error) {
    throw new Error('Logout failed');
  }
};

export const hasAccess = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<string | null> => {
  if (!refreshToken) return null;
  if (!accessToken) {
    const newAccessToken = await refresh();
    return newAccessToken || null;
  }
  return accessToken;
};
