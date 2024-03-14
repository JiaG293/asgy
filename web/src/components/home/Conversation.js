// conversation.js

import React from "react";
import "../homeStyle/Conversation.scss"; //
import Header from "./Header"; // Import Header component
import { FiSend as SendIcon } from "react-icons/fi";

function Conversation() {
  return (
    <div className="conversation-container">
      <Header />

      <div className="conversation-messages">
        <div className="conversation-item-you">alo</div>
        <div className="conversation-item-me">alo</div>

      </div>

      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
          />
          <button className="conversation-button">
            <span style={{marginRight:10}}>Gửi</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
