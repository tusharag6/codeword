import RegisterCard from '../components/RegisterCard';
import authBg from '../assets/auth.svg';

function Register() {
  return (
    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="container max-w-sm md:max-w-md w-full ">
        <RegisterCard />
      </div>
    </div>
  );
}

export default Register;
