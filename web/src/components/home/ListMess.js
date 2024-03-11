import React from 'react';
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";

function ListMess({ onSelected }) {
  // Hàm này sẽ được gọi khi một chatItem được click
  const selectConversation = (conversation) => {
    console.log('Conversation selected:', conversation);
    onSelected && onSelected(conversation); // Đẩy conversation đã chọn ra ngoài component này
  };

  return (
    <div className="chatPanel">
      {/* Tìm kiếm */}
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." className="searchBarInput" />
        <SearchIcon className="searchIcon" onClick={() => {console.log('Search clicked');}} />
      </div>
      
      {/* Danh sách cuộc trò chuyện */}
      {/* Click vào một chatItem sẽ gọi hàm selectConversation với thông tin cuộc trò chuyện tương ứng */}
      <div className="chatItem" onClick={() => selectConversation('Nhi Nhi')}>
        <div className="avatar"></div>
        <div className="content">
          <div className="name">Nhi Nhi</div>
          <div className="message">con cho Ngoc ha? a</div>
        </div>
      </div>
      <div className="chatItem" onClick={() => selectConversation('BaBy')}>
        <div className="avatar"></div>
        <div className="content">
          <div className="name">BaBy</div>
          <div className="message">de mai e dap no cho</div>
        </div>
      </div>
    </div>
  );
}

export default ListMess;
