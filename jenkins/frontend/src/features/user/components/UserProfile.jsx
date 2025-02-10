// filepath: /c:/Users/SSAFY/Kims/S12P11B204/project/frontend/src/features/user/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUser } from '../../../api/user';

const UserProfile = () => {
  const { user, setUser } = useUser();
  const { accessToken } = useAuth();
  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser({ nickname, email });
      setUser(updatedUser);
    } catch (error) {
      console.error('사용자 프로필 업데이트 실패', error);
    }
  };

  useEffect(() => {
    setNickname(user.nickname);
    setEmail(user.email);
  }, [user]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nickname">Nickname:</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UserProfile;