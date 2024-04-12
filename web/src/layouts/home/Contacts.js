import React, { useEffect, useState } from "react";
import "../homeStyle/Contacts.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { PiUserListBold as FriendListIcon } from "react-icons/pi";
import { FaUserFriends as GroupListIcon } from "react-icons/fa";
import { LuMailOpen as RequestListIcon } from "react-icons/lu";
import { FaUserPlus as AddFriendIcon } from "react-icons/fa";

import Cookies from "js-cookie";
import axios from "axios";
import statusCode from "utils/statusCode";
import { profileID } from "env/env";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

function Contacts({ onSelectMenuItem }) {
  const [stringFind, setStringFind] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả tìm kiếm
  const [timer, setTimer] = useState(null);

  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const clientID = Cookies.get("clientId");
      const headers = {
        "x-client-id": clientID,
        authorization: refreshToken,
      };

      if (stringFind.trim() !== "") {
        const response = await axios.get(
          `http://localhost:5000/api/v1/profile/search/${stringFind}`,
          {
            headers,
          }
        );
        if (response.status === statusCode.OK) {
          const res = response.data.metadata;
          setSearchResults(res);
        } else {
          console.error("Lỗi khi lấy thông tin người dùng");
        }
      } else {
        // Nếu ô tìm kiếm rỗng, hiển thị lại menu mặc định
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  // Hàm xử lý sự kiện thay đổi giá trị của ô tìm kiếm
  const handleInputChange = (event) => {
    const value = event.target.value;
    setStringFind(value);
  };


  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    // Đặt timer mới
    setTimer(
      setTimeout(() => {
        // Kiểm tra nếu chuỗi có ít nhất 6 ký tự thì gọi fetchData
        fetchData();
      }, 500)
    );

    // Cleanup function
    return () => clearTimeout(timer);
  }, [stringFind]);
  


  return (
    <PerfectScrollbar className="contacts-panel">
      {/* Tìm kiếm */}
      <div className="contact-search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="contact-menu-input"
          value={stringFind}
          onChange={handleInputChange}
        />
        <SearchIcon className="contact-menu-search-icon" />
      </div>

      {/* menu */}
      {!stringFind ? (
        <div className="contacts-menu">
          <div
            className="contact-menu-item"
            onClick={() => onSelectMenuItem("friendList")}
          >
            <FriendListIcon className="menu-icon" />
            <span className="menu-text">Danh sách bạn bè</span>
          </div>
          <div
            className="contact-menu-item"
            onClick={() => onSelectMenuItem("groupList")}
          >
            <GroupListIcon className="menu-icon" />
            <span className="menu-text">Danh sách nhóm</span>
          </div>
          <div
            className="contact-menu-item"
            onClick={() => onSelectMenuItem("requestList")}
          >
            <RequestListIcon className="menu-icon" />
            <span className="menu-text">Lời mời kết bạn</span>
          </div>
        </div>
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="contacts-menu">
              {searchResults.map((item) => (
                <div className="contact-menu-item" key={item?._id}>
                  <div className="contact-menu-avatar-container">
                    <img src={item?.avatar} />
                  </div>
                  <div className="contact-menu-information">
                    <p className="contact-menu-fullname">{item?.fullName}</p>
                    <p className="contact-menu-username">
                      {item?.user_details?.username}
                    </p>
                  </div>
                  {profileID !== item?._id ? (
                    <AddFriendIcon
                      className="contact-add-friend-icon"
                      onClick={() => {
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && (
            <div className="no-results-message">
              Không tìm thấy kết quả phù hợp.
            </div>
          )}
        </>
      )}
    </PerfectScrollbar>
  );
}

export default Contacts;
