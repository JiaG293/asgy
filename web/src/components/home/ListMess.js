// ListMess.jsx

import React from 'react';
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";

function ListMess({ onSelectMessage }) {
  const messages = [
    { id: 1, name: "Nhi Nhi", content: "hello" },
    { id: 2, name: "BaBy", content: "hi bạn" }
  ];

  const handleSelectMessage = (message) => {
    onSelectMessage(message);
  };

  return (
    <div className="listmess-chat-panel">
      <div className="listmess-search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="listmess-search-bar-input" />
        <SearchIcon className="listmess-search-icon" />
      </div>
      {messages.map((message) => (
        <div key={message.id} className="listmess-chat-item" onClick={() => handleSelectMessage(message)}>
          <div className="listmess-avatar"></div>
          <div className="listmess-content">
            <div className="listmess-name">{message.name}</div>
            <div className="listmess-message">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListMess;
