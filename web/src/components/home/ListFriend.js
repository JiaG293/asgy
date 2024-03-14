import React from "react";
import "../homeStyle/ListFriend.scss";
import { PiUserListBold } from "react-icons/pi";

function ListFriend() {
  const friends = [
    { id: 1, name: "Ân" },
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
    { id: 4, name: "Eve" },
  ];
  
  // Sắp xếp danh sách bạn bè theo tên và phân loại vào đối tượng theo bảng chữ cái
  const friendsByAlphabet = {};
  
  friends.forEach((friend) => {
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
    console.log(letter);
    friendsByAlphabet[letter].forEach((friend) => {
      console.log(friend.name);
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
