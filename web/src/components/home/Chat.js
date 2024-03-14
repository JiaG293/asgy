import React, { useState } from 'react';
import '../homeStyle/Chat.scss'; //

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
    <div className="chat-Home">
      {/* <Header/> */}
        <div className="input-Container">
          <input
            className="text-Input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handerSendMessage}
            placeholder="Nhập tin nhắn của bạn..."
          />
          <button className="send-Button" onClick={sendMessage}>
            Gửi
          </button>

        </div>
      

    </div>
  );
}

export default Chat;