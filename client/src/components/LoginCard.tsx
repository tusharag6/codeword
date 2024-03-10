import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { login } from '../api/auth';

export const loginSchema = z.object({
  email: z.string().email().min(5, 'Email is required'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export default function LoginCard() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/');
      toast.success('Login successful');
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const onSubmit: SubmitHandler<TLoginSchema> = (data) => {
    try {
      mutate(data);
      reset();
    } catch (error) {
      // console.error('Login failed:', error);
    }
  };

  return (
    <Card className="border-transparent">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-bold">Welcome back!</CardTitle>
        <CardDescription className="text-[#a4a9b0] hidden xs:block">
          We&apos;re so excited to see you again!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="pb-1">
                Email
              </Label>
              <Input
                {...register('email')}
                type="email"
                id="email"
                className="bg-input border-transparent"
                required
              />
              {errors.email && (
                <p className="text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="pb-1">
                Password
              </Label>
              <Input
                {...register('password')}
                type="password"
                id="password"
                className="bg-input border-transparent"
                required
              />
              {errors.password && (
                <p className="text-red-500">{`${errors.password.message}`}</p>
              )}
              <div className="text-xs text-[#0b8ccd]">
                Forgot your password?{' '}
              </div>
            </div>
          </div>
          <Button
            disabled={isSubmitting || isPending}
            type="submit"
            className="w-full disabled:bg-gray-500 mt-4"
          >
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-[#a4a9b0]">
          Need an account?
          <Link className="text-[#0b8ccd]" to="/register">
            {' '}
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
