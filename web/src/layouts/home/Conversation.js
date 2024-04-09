import React, { useEffect, useState } from "react";
import "../homeStyle/Conversation.scss";
import Header from "./Header";
import { FiSend as SendIcon } from "react-icons/fi";
import { useSelector } from "react-redux";
import socket from "socket/socket";

function Conversation() {
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const [messageContent, setMessageContent] = useState("");
  const messagesList = useSelector((state) => state.messagesList);

  const message = messagesList && messagesList.map((message) => (
    <div
      key={message._id}
      className={
        message.senderId._id === profileID
          ? "conversation-item-me"
          : "conversation-item-you"
      }
    >
      <div className="message-content">{message.messageContent}</div>
    </div>
  ));

  return (
    <div className="conversation-container">
      <Header />
      <div className="conversation-messages">{message}</div>
      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
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
