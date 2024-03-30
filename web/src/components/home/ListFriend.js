import React, { useEffect, useState } from "react";
import "../homeStyle/ListFriend.scss";
import { PiUserListBold } from "react-icons/pi";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";

function ListFriend() {
  const [listFriend, setListFriend] = useState([]);

  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");

      // Giải mã refreshToken để xem thông tin chứa trong nó
      const decodedToken = jwtDecode(refreshToken);
      const clientID = decodedToken.clientId;
      const headers = {
        "X-Client-Id": clientID,
        Authorization: refreshToken,
      };
      // Gửi yêu cầu lấy thông tin người dùng sử dụng refreshToken
      const response = await axios.get(
        "http://localhost:5000/api/v1/profile/friends",
        { headers }
      );
      // Lấy dữ liệu thông tin người dùng và cập nhật state
      if (response.status === 200) {
        const listFriend = response.data.metadata.friends;
        setListFriend(listFriend);
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      if (error.response) {
        console.error("Data request server:", error.response);
      }
      if (error.config && error.config.headers) {
        console.error("Headers request:", error.config.headers);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sắp xếp danh sách bạn bè theo tên và phân loại vào đối tượng theo bảng chữ cái
  const friendsByAlphabet = {};

  listFriend.forEach((friend) => {
    const firstLetter = friend.name.charAt(0).toUpperCase();
    if (!friendsByAlphabet[firstLetter]) {
      friendsByAlphabet[firstLetter] = [];
    }
    friendsByAlphabet[firstLetter].push(friend);
  });

  // Lấy danh sách các bảng chữ cái được sắp xếp
  const alphabets = Object.keys(friendsByAlphabet).sort((a, b) => {
    return a.localeCompare(b, "vi", { sensitivity: "base" });
  });

  // Render danh sách bạn bè theo bảng chữ cái
  alphabets.forEach((letter) => {
    friendsByAlphabet[letter].forEach((friend) => {
      // console.log(friend.name);
    });
  });

  return (
    <div className="listfriends-container">
      <div className="listfriend-header">
        <PiUserListBold className="listfriend-icon" />
        <span className="listfriend-text">Danh sách bạn bè</span>
      </div>
      <div className="listfriend-card">
        {/* Render danh sách bạn bè theo bảng chữ cái */}
        {alphabets.map((letter) => (
          <div key={letter}>
            <h3>{letter}</h3>
            {friendsByAlphabet[letter].map((friend) => (
              <div key={friend.id} className="friend-item">
                {friend.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListFriend;
