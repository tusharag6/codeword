import LoginCard from '../components/LoginCard';
import authBg from '../assets/authBg.svg';

function Login() {
  return (
    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <LoginCard />
    </div>
  );
}

export default Login;
