import { Link } from 'react-router-dom';
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

export default function LoginCard() {
  return (
    <Card className="w-[30%] border bg-[#313338] border-transparent text-white">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-bold">Welcome back!</CardTitle>
        <CardDescription className="text-[#a4a9b0]">
          We&apos;re so excited to see you again!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="pb-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                className="bg-[#1e1f22] border-transparent"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="pb-1">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                className="bg-[#1e1f22] border-transparent"
                required
              />
              <div className="text-xs text-muted-foreground text-[#0b8ccd]">
                Forgot your password?{' '}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        <Button className="w-full bg-[#5865f2]">Login</Button>
        <div className="text-sm text-muted-foreground text-[#a4a9b0]">
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
