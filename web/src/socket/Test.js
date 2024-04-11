import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Test = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Lắng nghe tin nhắn từ server và xử lý
    socket.on('sendMessageToClient', (message) => {
      console.log('Received message from server:', message);
      // Xử lý tin nhắn ở đây (nếu cần)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Hàm xử lý khi người dùng gửi tin nhắn đến server
  const handleSendMessage = () => {
    const socket = io('http://localhost:5000');
    socket.emit('sendMessageToServer', message);
    // console.log('Sent message to server:', message);
  };

  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Gửi tin nhắn</button>
    </div>
  );
};

export default Test;
