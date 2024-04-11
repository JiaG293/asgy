// components/MessageItem.js
import React from 'react';
import './MessageItem.css';

function MessageItem({ message }) {
  return (
    <div className="messageItem">
      <div className="messageItem__avatar">
        <img src={message.avatar} alt="Avatar" />
      </div>
      <div className="messageItem__content">
        <div className="messageItem__info">
          <span className="messageItem__fullName">{message.fullName}</span>
          <span className="messageItem__updatedAt">{new Date(message.updatedAt).toLocaleString()}</span>
        </div>
        <div className="messageItem__message">
          <p>{message.messageContent}</p>
          {message.typeContent === 'image' && (
            <img src={message.avatar} alt="Content" />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
