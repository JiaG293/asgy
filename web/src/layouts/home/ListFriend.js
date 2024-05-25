import React, { useEffect, useLayoutEffect, useState } from "react";
import "../homeStyle/ListFriend.scss";
import { PiUserListBold } from "react-icons/pi";
import { useSelector } from "react-redux";

function ListFriend() {
  // const [listFriend, setListFriend] = useState([]);

  const friendsList = useSelector((state) => state.friendsList);

  // Sắp xếp danh sách bạn bè theo tên và phân loại vào đối tượng theo bảng chữ cái
  const friendsByAlphabet = {};

  friendsList.forEach((friend) => {
    const firstLetter = friend.fullName.charAt(0).toUpperCase();
    if (!friendsByAlphabet[firstLetter]) {
      friendsByAlphabet[firstLetter] = [];
    }
    friendsByAlphabet[firstLetter].push(friend);
  });

  // Lấy danh sách các bảng chữ cái được sắp xếp
  const alphabets = Object.keys(friendsByAlphabet).sort((a, b) => {
    return a.localeCompare(b, "vi", { sensitivity: "base" });
  });

  // Render danh sách bạn bè theo bảng chữ cái ---> lấy alphatbets map vào mảng
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
              <div key={friend.profileIdFriend} className="friend-item">
                <div className="friend-avatar-container">
                  <img src={friend?.avatar} className="f"></img>
                </div>
                <div className="friend-information">
                  <p className="friend-fullName">{friend?.fullName}</p>
                  <p className="friend-username">{friend?.username}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListFriend;
