import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className="chat-message">
          <strong>{msg.sender}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;