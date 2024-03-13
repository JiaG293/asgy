import React from "react";
import "../homeStyle/Contacts.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { PiUserListBold } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
import { LuMailOpen } from "react-icons/lu";

function Contacts() {
  return (
    <div className="contacts-Panel">
      {/* Tìm kiếm */}
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="searchBar-Input" />
        <SearchIcon className="search-Icon" ></SearchIcon>
      </div>

      {/* menu */}
      <div className="menu-Contacts">
        <div className="menu-Item">
          <PiUserListBold className="menu-Icon" />
          <span className="menu-Text">Danh sách bạn bè</span>
        </div>
        <div className="menu-Item">
          <FaUserFriends className="menu-Icon" />
          <span className="menu-Text">Danh sách nhóm</span>
        </div>
        <div className="menu-Item">
          <LuMailOpen className="menu-Icon" />
          <span className="menu-Text">Lời mời kết bạn</span>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
