// components/Chat.js
import React, { useEffect } from 'react';
import './Chat.css';
import Sidebar from '../Sidebar/Sidebar';
import ChatBody from '../ChatBody/ChatBody';

import socket from '../../socket/socket'


function Chat() {
  // Dữ liệu mẫu cho danh sách nhóm
  const groups = [
    {
      id: 1,
      icon: 'https://asgy.s3.ap-southeast-1.amazonaws.com/profile/avatar_1712039678116-584951610singapore.png',
      channelId: 'channel1',
      lastMessage: 'Hello everyone!',
      updatedAt: '2022-04-06T09:15:00Z',
      name: 'Group 1'
    },
    {
      id: 2,
      icon: 'https://asgy.s3.ap-southeast-1.amazonaws.com/profile/avatar_1712039678116-584951610singapore.png',
      channelId: 'channel2',
      lastMessage: 'Welcome to the group!',
      updatedAt: '2022-04-06T09:20:00Z',
      name: 'Group 2'
    }
  ];

  // Dữ liệu mẫu cho tin nhắn
  const messages = [
    {
      id: 1,
      profileId: 1,
      fullName: 'John Doe',
      updatedAt: '2022-04-06T09:15:00Z',
      messageContent: 'Hello, how are you?',
      typeContent: 'text',
      _id: 'message1',
      avatar: 'https://asgy.s3.ap-southeast-1.amazonaws.com/profile/avatar_1712039678116-584951610singapore.png'
    },
    {
      id: 2,
      profileId: 2,
      fullName: 'Jane Smith',
      updatedAt: '2022-04-06T09:20:00Z',
      messageContent: 'I\'m doing well, thank you!',
      typeContent: 'text',
      _id: 'message2',
      avatar: 'https://asgy.s3.ap-southeast-1.amazonaws.com/profile/avatar_1712039678116-584951610singapore.png'
    }
  ];


  useEffect(() => {

    console.log("socket.connected", socket.connected, socket);

    socket.emit('addUser', { profileId: "65f401b7ec07e9ea6c2b457e", channels: ["66148db6a62692f6d9cf2eb9"] })

    socket.emit('loadMessages', { senderId: "65f401b7ec07e9ea6c2b457e" })

    // Xử lý sự kiện khi nhận được tin nhắn từ server
    socket.on('getMessages', (data) => {
      console.log('Received message:', data);
      
     
    });

    /* return () => {
      // Ngắt kết nối socket khi component bị unmount
      socket.disconnect();
    }; */
  }, []);

  

  return (
    <div className="chat">
      <Sidebar groups={groups} />
      <ChatBody messages={messages} />
    </div>
  );
}

export default Chat;



/* 
import React, { useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatBody from '../ChatBody/ChatBody';
import io from 'socket.io-client';

const ChatComponent = ({ groups }) => {
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Thay đổi URL và cổng theo máy chủ của bạn

    // Xử lý sự kiện khi nhận được tin nhắn từ server
    socket.on('message', (data) => {
      console.log('Received message:', data);
      // Xử lý dữ liệu tin nhắn ở đây, có thể cập nhật state của component
    });

    return () => {
      // Ngắt kết nối socket khi component bị unmount
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chat">
      <Sidebar groups={groups} />
      <ChatBody />
    </div>
  );
};

export default ChatComponent; */
