import authBg from '../assets/authBg.svg';

function Login() {
  return (
    <div
      className="bg-cover bg-center h-screen w-full"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="text-white text-4xl">Login</div>
    </div>
  );
}

export default Login;
