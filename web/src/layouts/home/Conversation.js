import React from "react";
import "../homeStyle/Conversation.scss";
import Header from "./Header";
import { FiSend as SendIcon } from "react-icons/fi";

// Hàm render tin nhắn
function renderMessage(message) {
  return (
    <div className="conversation-item-you">{message.content}</div>
  );
}

function Conversation({ message }) {
  return (
    <div className="conversation-container">
      <Header />
      <div className="conversation-messages">
        {/* Gọi hàm render tin nhắn */}
        {message && renderMessage(message)}
      </div>
      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
          />
          <button className="conversation-button">
            <span style={{ marginRight: 10 }}>Gửi</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
