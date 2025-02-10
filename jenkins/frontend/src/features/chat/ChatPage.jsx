import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getChatHistory } from '../../api/chat';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { Client } from '@stomp/stompjs';

const ChatPage = ({ receiver }) => {
  const { accessToken } = useAuth(); // useContext(AuthContext) 대신 useAuth() 사용
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!accessToken) return; // 토큰이 없으면 실행하지 않음
      try {
        const chatHistory = await getChatHistory(accessToken, receiver);
        setMessages(chatHistory);
      } catch (error) {
        console.error('채팅 기록 불러오기 실패', error);
      }
    };

    fetchChatHistory();
  }, [accessToken, receiver]);

  useEffect(() => {
    if (!accessToken) return;

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // WebSocket 서버 URL
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/topic/messages/${receiver}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log('Disconnected from WebSocket');
      }
    };
  }, [accessToken, receiver]);

  const handleSendMessage = useCallback((message) => {
    if (!accessToken) return;

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const chatMessage = {
      sender: 'CURRENT_USER_ID', // FIXME: 실제 사용자 ID로 변경 필요
      receiver,
      content: message,
    };

    stompClient.publish({
      destination: `/app/chat/${receiver}`,
      body: JSON.stringify(chatMessage),
    });
  }, [accessToken, receiver]);

  return (
    <div>
      <h1>Chat with {receiver}</h1>
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
