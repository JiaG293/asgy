import React, { useState } from "react";
import "../homeStyle/AddGroupModal.scss";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { profileID } from "env/env";
import { toast } from "react-toastify";
import socket from "socket/socket";

const AddMemberModal = ({ onClose }) => {
  const friendsList = useSelector((state) => state.friendsList);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const currentChannel = useSelector((state) => state.currentChannel);

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

  // Hàm xử lý khi click vào checkbox
  const handleCheckboxChange = (friendId) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(friendId)) {
        // Nếu friendId đã có trong danh sách, loại bỏ nó đi
        const updatedMembers = prevSelectedMembers.filter(
          (id) => id !== friendId
        );
        console.log(`Người dùng bỏ chọn thành viên có ID: ${friendId}`);
        console.log("Danh sách ID thành viên đã chọn:", updatedMembers);
        return updatedMembers;
      } else {
        // Nếu friendId chưa có trong danh sách, thêm nó vào
        const updatedMembers = [...prevSelectedMembers, friendId];
        console.log(`Người dùng đã chọn thành viên có ID: ${friendId}`);
        console.log("Danh sách ID thành viên đã chọn:", updatedMembers);
        return updatedMembers;
      }
    });
  };

  const handleCreateGroup = () => {

    const channelId = currentChannel._id;
    const members = selectedMembers;
  
    socket.emit('addMembers', { channelId, members });
    
    socket.on('addMembers', (response) => {
        console.log(response.message);
        console.log(currentChannel);
    });

    window.location.reload(); 
    toast.success("Thêm thành công")
    
  };

  return (
    <div className="add-group-modal-container">
      <div className="add-group-modal-header">
        <h1 className="add-group-modal-title">Thêm thành viên</h1>
      </div>
      <PerfectScrollbar className="add-group-modal-friend-list">
        {alphabets.map((letter) => (
          <div key={letter}>
            <h3>{letter}</h3>
            {friendsByAlphabet[letter].map((friend) => (
              <div
                className="add-group-modal-friend-item"
                key={friend.profileIdFriend}
              >
                <input
                  type="checkbox"
                  className="add-group-modal-checkbox"
                  onChange={() => handleCheckboxChange(friend.profileIdFriend)} // Xử lý sự kiện khi checkbox thay đổi
                />
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
        <button
          className="add-group-modal-button cancel-button"
          type="button"
          onClick={onClose}
        >
          Thoát
        </button>
        <button
          className="add-group-modal-button create-group-button"
          type="button"
          onClick={handleCreateGroup}
        >
          Thêm thành viên
        </button>
      </div>
    </div>
  );
};

export default AddMemberModal;
