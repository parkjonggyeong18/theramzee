import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { connectSocket, subscribeToTopic, sendMessage } from '../../api/stomp';
import { apiRequest } from '../../api/apiService';
import { FriendContext } from '../../contexts/FriendContext';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const ChatPage = ({ receiver, isOpen, onClose }) => {
  const { fetchUnreadCounts, isActiveChatRoom } = useContext(FriendContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!isOpen || !receiver) return;

    const username = sessionStorage.getItem("username");
    const nickname = sessionStorage.getItem("nickName");

    console.log('Chat initialization:', { username, nickname, receiver });

    if (!username || !nickname) {
      console.error('로그인된 사용자가 없습니다.');
      return;
    }

    const loadChatHistory = async () => {
      try {
        const response = await apiRequest(
          `/api/v1/chat/history?sender=${nickname}&receiver=${receiver}`,
          'GET'
        );
        console.log('Chat history response:', response);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else if (response.data && Array.isArray(response.data.messages)) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('채팅 기록 로드 실패:', error);
        setMessages([]);
      }
    };

    const setupWebSocket = async () => {
      try {
        await connectSocket();
        // 자신의 username으로 메시지 수신을 위한 구독
        const myTopic = `/topic/messages/${username}`;
        console.log('Subscribing to my topic:', myTopic);
        
        subscribeToTopic(myTopic, (message) => {
          console.log('Received message:', message);
          setMessages(prev => {
            // // 중복 메시지 방지
            // const isDuplicate = prev.some(m => 
            //   m.sender === message.sender && 
            //   m.content === message.content && 
            //   m.timestamp === message.timestamp
            // );
            // if (isDuplicate) return prev;
            return [...prev, message];
          });
        });
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
    };

    loadChatHistory();
    setupWebSocket();
    // markAsRead();
  }, [isOpen, receiver]);

  // // 창 포커스 시 읽음 처리
  // useEffect(() => {
  //   const handleFocus = () => markAsRead();
  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, [isOpen, receiver]);

  const markAsRead = async () => {
    if (!isActiveChatRoom(receiver)) return;
    
    try {
      await apiRequest("/api/v1/chat/mark-as-read", "PUT", {
        sender: receiver,
        receiver: sessionStorage.getItem("nickName")
      });
      fetchUnreadCounts();
    } catch (error) {
      console.error("메시지 읽음 처리 실패:", error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const username = sessionStorage.getItem("username");
    try {
      const message = {
        sender: username,
        receiver: receiver,
        content: content.trim(),
        timestamp: new Date().toISOString()
      };

      await sendMessage("/app/chat.send", message);
      
      // 보낸 메시지를 즉시 화면에 표시
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <ChatOverlay $isOpen={isOpen} onClick={markAsRead}>
      <ChatContainer>
        <ChatHeader receiver={receiver} onClose={onClose} />
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </ChatContainer>
    </ChatOverlay>
  );
};

const ChatOverlay = styled.div`
  position: fixed;
  // top: 0;
  bottom: 0;
  right: ${props => props.$isOpen ? '400px' : '-800px'};
  width: 400px;
  height: 50%;
  background-color: rgba(45, 24, 16, 0.95);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out, right 0.3s ease-in-out;
  z-index: 999;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export default ChatPage;