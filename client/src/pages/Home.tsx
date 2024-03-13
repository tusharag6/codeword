import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { logoutUser, refresh } from '../api/auth';

interface UserInfo {
  id: string;
  email: string;
  username: string;
}

function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.get('/user/profile');
      const responseData = response.data;
      setUserInfo(responseData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        !Cookies.get('refreshToken') ||
        !localStorage.getItem('accessToken')
      ) {
        toast.error('Please login to continue');
        navigate('/login');
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
      }

      if (error.response.status === 401) {
        const newAccessToken = await refresh();
        if (newAccessToken) {
          await fetchUserInfo();
        }
      }
      throw new Error('Fetching failed');
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate('/login');
      toast.success('Logout successful');
    },
    onError: async (error) => {
      if (error) {
        const newAccessToken = await refresh();
        if (newAccessToken) {
          mutate();
        }
      } else {
        toast.error('Logout failed');
      }
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
      <div>
        <h2>User Info</h2>
        <p>ID: {userInfo?.id}</p>
        <p>Email: {userInfo?.email}</p>
        <p>Username: {userInfo?.username}</p>
        {/* Add more user info fields as needed */}
      </div>
      <button onClick={fetchUserInfo} type="submit">
        Fetch User Info
      </button>
    </div>
  );
}

export default Home;
