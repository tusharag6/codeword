import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  email: z.string().email().min(5, 'Email is required'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export const loginSchema = z.object({
  email: z.string().email().min(5, 'Email is required'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
