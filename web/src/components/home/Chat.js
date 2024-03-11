import React, { useState } from 'react';
import '../homeStyle/Chat.scss'; // Import file SCSS
import Header from './Header'; //

function Chat() {
  // State để theo dõi nội dung nhập vào
  const [message, setMessage] = useState('');

  // Hàm gọi khi nút gửi được nhấn
  const sendMessage = () => {
    setMessage(''); // Reset input field sau khi gửi
  };

  const handerSendMessage = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatHome">
      <Header/>
        <div className="inputContainer">
          <input
            className="textInput"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handerSendMessage}
            placeholder="Nhập tin nhắn của bạn..."
          />
          <button className="sendButton" onClick={sendMessage}>
            Gửi
          </button>

        </div>
      

    </div>
  );
}

export default Chat;