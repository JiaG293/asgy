import React from "react";
import "../homeStyle/Contacts.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { PiUserListBold as FriendListIcon} from "react-icons/pi";
import { FaUserFriends as GroupListIcon} from "react-icons/fa";
import { LuMailOpen as RequestListIcon } from "react-icons/lu";

function Contacts({ onSelectMenuItem }) {
  return (
    <div className="contacts-panel">
      {/* Tìm kiếm */}
      <div className="search-bar">
        <input type="menu-text" placeholder="Tìm kiếm..." className="menu-input" />
        <SearchIcon className="menu-search-icon" ></SearchIcon>
      </div>

      {/* menu */}
      <div className="contacts-menu">
        <div className="contact-menu-item" onClick={() => onSelectMenuItem("friendList")}>
          <FriendListIcon className="menu-icon" />
          <span className="menu-text">Danh sách bạn bè</span>
        </div>
        <div className="contact-menu-item" onClick={() => onSelectMenuItem("groupList")}>
          <GroupListIcon className="menu-icon" />
          <span className="menu-text">Danh sách nhóm</span>
        </div>
        <div className="contact-menu-item" onClick={() => onSelectMenuItem("requestList")}>
          <RequestListIcon className="menu-icon" />
          <span className="menu-text">Lời mời kết bạn</span>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
