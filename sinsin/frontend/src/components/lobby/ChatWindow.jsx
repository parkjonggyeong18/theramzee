// components/lobby/ChatWindow.jsx
import { useState } from 'react';
import styled from 'styled-components';

const ChatWindow = ({ friendName, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <span>{friendName}</span>
        <CloseButton onClick={onClose}>X</CloseButton>
      </ChatHeader>
      
      <ChatBody>
        {messages.map((msg) => (
          <Message key={msg.id} isMine={msg.sender === 'me'}>
            {msg.text}
          </Message>
        ))}
      </ChatBody>

      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton onClick={handleSendMessage}>전송</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 400px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #333;
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  background: ${({ isMine }) => (isMine ? '#DCF8C6' : '#FFF')};
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  align-self: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SendButton = styled.button`
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

export default ChatWindow;