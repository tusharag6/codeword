import { AxiosResponse } from 'axios';
import type { TLoginSchema } from '@/components/LoginCard';
import type { TRegisterSchema } from '@/components/RegisterCard';
import api from './axios';

export const login = async (formData: TLoginSchema): Promise<TLoginSchema> => {
  try {
    const response: AxiosResponse = await api.post('/user/login', formData, {
      withCredentials: true,
    });
    const responseData: TLoginSchema = response.data;
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('Logout failed:', error);

    throw new Error('Logout failed');
  }
};
