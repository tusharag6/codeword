import { AxiosResponse } from 'axios';
import { useState } from 'react';
import api from '../api/axios';

interface UserInfo {
  id: string;
  email: string;
  username: string;
}

function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchUserInfo = async () => {
    try {
      const response: AxiosResponse = await api.get('/user/profile');
      const responseData = response.data;
      setUserInfo(responseData);
    } catch (error) {
      throw new Error('Fetching failed');
    }
  };

  return (
    <div>
      <h1>Home</h1>
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
