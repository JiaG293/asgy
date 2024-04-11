import React from 'react';
import './ChatBody.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';

function ChatBody({ messages }) {
  return (
    <div className="chatBody">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  );
}

export default ChatBody;

/* import React, { useEffect } from 'react';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import io from 'socket.io-client';

const ChatBody = ({ messages }) => {
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      withCredentials: true
    });
    socket.emit('addUser', { profileId: "65f401b7ec07e9ea6c2b457e", channels: ["66148db6a62692f6d9cf2eb9"] })

    socket.emit('loadMessages', { senderId: "65f401b7ec07e9ea6c2b457e" })
    // Xử lý sự kiện khi nhận được tin nhắn từ server
    socket.on('getMessages', (data) => {
      console.log('Received message:', data);
      // Xử lý dữ liệu tin nhắn ở đây, có thể cập nhật state của component
    });

    return () => {
      // Ngắt kết nối socket khi component bị unmount
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chatBody">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  );
};

export default ChatBody; */
