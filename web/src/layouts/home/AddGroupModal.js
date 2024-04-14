import React from "react";
import "../homeStyle/AddGroupModal.scss";
import { useSelector } from "react-redux";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const AddGroupModal = () => {
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

  // Render danh sách bạn bè theo bảng chữ cái
  const sortedFriendsList = alphabets.flatMap(
    (letter) => friendsByAlphabet[letter]
  );

  return (
    <div className="add-group-modal-container">
      <div className="add-group-modal-header">
        <h1 className="add-group-modal-title">Tạo nhóm mới</h1>
        <input
          className="add-group-modal-group-name"
          placeholder="Đặt tên nhóm"
        />
      </div>
      <PerfectScrollbar className="add-group-modal-friend-list">
        {alphabets.map((letter) => (
          <div key={letter}>
            <h3>{letter}</h3>
            {friendsByAlphabet[letter].map((friend) => (
              <div key={friend.id} className="add-group-modal-friend-item">
                <input type="checkbox" className="add-group-modal-checkbox" />
                <div className="friend-avatar-container">
                  <img src={friend.avatar} className="friend-avatar" />
                </div>
                <div className="add-group-modal-information">
                  <p className="add-group-modal-fullname">{friend.fullName}</p>
                  <p className="add-group-modal-username">{friend.username}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </PerfectScrollbar>
      <div className="add-group-modal-buttons">
        <button className="add-group-modal-button cancel-button" type="button">
          Thoát
        </button>
        <button className="add-group-modal-button create-group-button" type="button">
          Tạo nhóm
        </button>
      </div>
    </div>
  );
};

export default AddGroupModal;
