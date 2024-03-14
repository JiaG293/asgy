// Chat.js

import React from "react";
import "../homeStyle/Chat.scss"; //
import Header from "./Header"; // Import Header component
import { FiSend as SendIcon } from "react-icons/fi";

function Chat() {
  return (
    <div className="chat-container">
      <Header />
      <div className="chat-messages"></div>
      <div className="chat-input-container">
        <div className="chat-input-with-button">
          <input
            className="chat-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
          />
          <button className="chat-button">
            <span style={{marginRight:10}}>Gửi</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
