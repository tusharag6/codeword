import RegisterCard from '../components/RegisterCard';
import authBg from '../assets/authBg.svg';

function Register() {
  return (
    <div
      className="bg-cover bg-center h-screen w-full flex justify-center items-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <RegisterCard />
    </div>
  );
}

export default Register;
