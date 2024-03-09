import { Link } from 'react-router-dom';
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

export default function RegisterCard() {
  return (
    <Card className="border border-transparent">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-bold">Create an Account</CardTitle>
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
                className="bg-input border-transparent"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="displayName" className="pb-1">
                Display Name
              </Label>
              <Input
                type="text"
                id="displayName"
                className="bg-input border-transparent"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username" className="pb-1">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                className="bg-input border-transparent"
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
                className="bg-input border-transparent"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dob" className="pb-1">
                Date of Birth
              </Label>
              <Input
                type="date"
                id="dob"
                className="bg-input border-transparent"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        <Button className="w-full">Continue</Button>
        <Link to="/login">
          <div className="text-sm text-[#0b8ccd]">Already have an account?</div>
        </Link>
      </CardFooter>
    </Card>
  );
}
