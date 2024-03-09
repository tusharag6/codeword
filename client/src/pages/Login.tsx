import LoginCard from '../components/LoginCard';
import authBg from '../assets/auth.svg';

function Login() {
  return (
    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="container max-w-sm md:max-w-md w-full ">
        <LoginCard />
      </div>
    </div>
  );
}

export default Login;
