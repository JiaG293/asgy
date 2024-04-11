// components/SidebarChat.js
import React from 'react';
import './SidebarChat.css';

function SidebarChat({ group }) {
  return (
    <div className="sidebarChat">
      <div className="sidebarChat__icon">
        <img src={group.icon} alt="Group Icon" />
      </div>
      <div className="sidebarChat__info">
        <h3>{group.name}</h3>
        <p>{group.lastMessage}</p>
      </div>
    </div>
  );
}

export default SidebarChat;
