// ListMess.js

import React from 'react';
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";

function ListMess({ onSelected }) {
  return (
    <div className="listmess-chat-panel">
      <div className="listmess-search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="listmess-search-bar-input" />
        <SearchIcon className="listmess-search-icon" />
      </div>
      <div className="listmess-chat-item">
        <div className="listmess-avatar"></div>
        <div className="listmess-content">
          <div className="listmess-name">Nhi Nhi</div>
          <div className="listmess-message">hello</div>
        </div>
      </div>
      <div className="listmess-chat-item">
        <div className="listmess-avatar"></div>
        <div className="listmess-content">
          <div className="listmess-name">BaBy</div>
          <div className="listmess-message">hi ban</div>
        </div>
      </div>
    </div>
  );
}

export default ListMess;
