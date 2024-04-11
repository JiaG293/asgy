// components/Sidebar.js
import React from 'react';
import './Sidebar.css';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import SidebarChat from '../SidebarChat/SidebarChat';

function Sidebar({ groups }) {
  return (
    <div className="sidebar">
      <SidebarHeader />
      <div className="sidebar__chats">
        {groups.map(group => (
          <SidebarChat key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
