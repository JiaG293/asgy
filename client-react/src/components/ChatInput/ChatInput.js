// ChatInput.js
import React, { useState } from 'react';
import './ChatInput.css';
import { RiImageAddLine, RiFileAddLine, RiVideoAddLine, RiHeadphoneLine, RiEmotionHappyLine } from 'react-icons/ri'; // Import icons từ thư viện react-icons
import SelectUser from '../SelectUser/SelectUser';

function ChatInput() {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSendMessage = () => {
    // Xử lý việc gửi tin nhắn văn bản
    console.log('Sending message:', message);
    // Reset trường nhập liệu
    setMessage('');
  };

  const handleFileInputChange = (e) => {
    // Lấy tệp từ sự kiện chọn file
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="chatInput">
      <div className="chatInput__icons">
        <label htmlFor="imageInput">
          <RiImageAddLine className="chatInput__icon" />
        </label>
        <label htmlFor="fileInput">
          <RiFileAddLine className="chatInput__icon" />
        </label>
        <label htmlFor="videoInput">
          <RiVideoAddLine className="chatInput__icon" />
        </label>
        <label htmlFor="audioInput">
          <RiHeadphoneLine className="chatInput__icon" />
        </label>
        <label htmlFor="emojiInput">
          <RiEmotionHappyLine className="chatInput__icon" />
        </label>
      </div>
      <input
        id="textInput"
        className="chatInput__textInput"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input id="imageInput" className="chatInput__fileInput" type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <input id="fileInput" className="chatInput__fileInput" type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <input id="videoInput" className="chatInput__fileInput" type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <input id="audioInput" className="chatInput__fileInput" type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <input id="emojiInput" className="chatInput__fileInput" type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <button className="chatInput__sendButton" onClick={handleSendMessage}>Send</button>
      <SelectUser></SelectUser>

    </div>
  );
}

export default ChatInput;
