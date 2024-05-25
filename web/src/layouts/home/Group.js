import React from "react";
import "../homeStyle/Group.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";

function Group() {
  return (
    <div className="group-Panel">
      {/* Tìm kiếm */}
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="searchBar-Input" />
        <SearchIcon className="search-Icon" ></SearchIcon>
      </div>

      {/* danh sach nhom */}
      <div className="chat-Item" >
        <div className="avatar"></div>
        <div className="content">
          <div className="name">Nhom 1</div>
          <div className="message">aDSfg</div>
        </div>
      </div>
      <div className="chat-Item" >
        <div className="avatar"></div>
        <div className="content">
          <div className="name">Nhom 2</div>
          <div className="message">tin nhan 2</div>
        </div>
      </div>

      
    </div>
  );
}

export default Group;
