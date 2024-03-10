import axios, { AxiosResponse } from 'axios';
import type { TLoginSchema } from '@/components/LoginCard';
import type { TRegisterSchema } from '@/components/RegisterCard';

export const login = async (formData: TLoginSchema): Promise<TLoginSchema> => {
  try {
    const response: AxiosResponse = await axios.post(
      '/api/user/login',
      formData
    );
    const responseData: TLoginSchema = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || 'Login failed');
    } else {
      throw new Error('Login failed');
    }
  }
};

export const registerUser = async (
  formData: TRegisterSchema
): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.post(
      '/api/user/register',
      formData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || 'Registration failed');
    } else {
      throw new Error('Registration failed');
    }
  }
};
