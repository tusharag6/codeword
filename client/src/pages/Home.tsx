import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { logoutUser } from '../api/auth';

interface UserInfo {
  id: string;
  email: string;
  username: string;
}

function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response: AxiosResponse = await api.get('/user/profile');
      const responseData = response.data;
      setUserInfo(responseData);
    } catch (error) {
      throw new Error('Fetching failed');
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      navigate('/login');
      toast.success('Logout successful');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  return (
    <div>
      <h1>Home</h1>
      <Button
        onClick={() => {
          mutate();
        }}
        type="submit"
        disabled={isPending}
      >
        Logout
      </Button>
      {userInfo ? (
        <div>
          <h2>User Info</h2>
          <p>ID: {userInfo.id}</p>
          <p>Email: {userInfo.email}</p>
          <p>Username: {userInfo.username}</p>
          {/* Add more user info fields as needed */}
        </div>
      ) : (
        <button onClick={fetchUserInfo} type="submit">
          Fetch User Info
        </button>
      )}
    </div>
  );
}

export default Home;
