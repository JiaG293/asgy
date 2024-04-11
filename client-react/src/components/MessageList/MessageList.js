// components/MessageList.js
import React from 'react';
import './MessageList.css';
import MessageItem from '../MessageItem/MessageItem';

function MessageList({ messages }) {
  return (
    <div className="messageList">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;

