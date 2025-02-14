import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFriendsList, getFriendRequests, sendFriendRequest, acceptFriendRequest, deleteFriend } from '../../api/friend';
import FriendList from './components/FriendList';
import FriendRequestList from './components/FriendRequestList';
import { Client } from '@stomp/stompjs';

const FriendPage = () => {
  const { accessToken } = useAuth();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newFriend, setNewFriend] = useState('');

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const [friendsList, friendRequests] = await Promise.all([
          getFriendsList(accessToken),
          getFriendRequests(accessToken),
        ]);
        setFriends(friendsList);
        setRequests(friendRequests);
      } catch (error) {
        console.error('데이터 불러오기 실패', error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const stompClient = new Client({
      brokerURL: 'wss://ramzee.online/ws',
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/friend-requests', (message) => {
          setRequests((prevRequests) => [...prevRequests, JSON.parse(message.body)]);
        });
        stompClient.subscribe('/topic/friend-accepts', (message) => {
          setFriends((prevFriends) => [...prevFriends, JSON.parse(message.body)]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken]);

  const handleAddFriend = useCallback(async () => {
    if (!newFriend.trim()) return;

    try {
      await sendFriendRequest(accessToken, newFriend);
      setNewFriend('');
      const updatedRequests = await getFriendRequests(accessToken);
      setRequests(updatedRequests);
    } catch (error) {
      console.error('친구 요청 실패', error);
    }
  }, [newFriend, accessToken]);

  const handleAcceptRequest = useCallback(async (senderNickname) => {
    try {
      await acceptFriendRequest(accessToken, senderNickname);
      const [updatedFriends, updatedRequests] = await Promise.all([
        getFriendsList(accessToken),
        getFriendRequests(accessToken),
      ]);
      setFriends(updatedFriends);
      setRequests(updatedRequests);
    } catch (error) {
      console.error('친구 요청 수락 실패', error);
    }
  }, [accessToken]);

  const handleDeleteFriend = useCallback(async (friendNickname) => {
    try {
      await deleteFriend(accessToken, friendNickname);
      const updatedFriends = await getFriendsList(accessToken);
      setFriends(updatedFriends);
    } catch (error) {
      console.error('친구 삭제 실패', error);
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Friends</h1>
      <div>
        <input
          type="text"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          placeholder="Enter friend's nickname"
        />
        <button onClick={handleAddFriend}>Add Friend</button>
      </div>
      <FriendList friends={friends} onDeleteFriend={handleDeleteFriend} />
      <FriendRequestList requests={requests} onAcceptRequest={handleAcceptRequest} />
    </div>
  );
};

export default FriendPage;
