import React from "react";
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { click } from "@testing-library/user-event/dist/click";

function ListMess() {
  return (
    <div className="chatPanel">
      {/* Tìm kiếm */}
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="searchBarInput" />
        <SearchIcon className="searchIcon" onClick={()=>{console.log('click');}}></SearchIcon>
      </div>
      {/* Danh sách cuộc trò chuyện */}
      <div className="chatItem">
        <div className="avatar"></div>
        <div className="content">
          <div className="name">Nhi Nhi</div>
          <div className="message">Hello</div>
        </div>
      </div>
      <div className="chatItem">
        <div className="avatar"></div>
        <div className="content">
          <div className="name">BaBy</div>
          <div className="message">Mãi yêuuuuu</div>
        </div>
      </div>
    </div>
  );
}

export default ListMess;
