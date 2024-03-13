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
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { registerUser } from '../api/auth';

export const registerSchema = z.object({
  username: z.string().min(5, 'Username must be at least 5 characters'),
  email: z.string().email().min(5, 'Email is required'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterCard() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
      toast.success('Registration successful');
    },
    onError: () => {
      toast.error('Registration failed');
    },
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = (data) => {
    try {
      mutate(data);
      reset();
    } catch (error) {
      // console.error('Registration failed:', error);
    }
  };

  return (
    <Card className="border border-transparent">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-bold">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username" className="pb-1">
                Username
              </Label>
              <Input
                {...register('username')}
                type="text"
                id="username"
                className="bg-input border-transparent"
                required
              />
              {errors.username && (
                <p className="text-red-500">{`${errors.username.message}`}</p>
              )}
            </div>
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
            </div>
          </div>
          <Button
            disabled={isSubmitting || isPending}
            type="submit"
            className="w-full disabled:bg-gray-500 mt-4"
          >
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        <Link to="/login">
          <div className="text-sm text-[#0b8ccd]">Already have an account?</div>
        </Link>
      </CardFooter>
    </Card>
  );
}
